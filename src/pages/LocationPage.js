/* @flow */

"use strict";

import React from 'react';
import Router from "react-router";
import NavigationArrowBack from
    "material-ui/lib/svg-icons/navigation/arrow-back";
import _ from 'underscore';
import mui from "material-ui";
import reactMixin from "react-mixin";
import sessionstorage from "sessionstorage";
import { debounce } from "core-decorators";

import Location from '../geolocation';
import Maps from '../maps';
import HeaderBar from '../components/HeaderBar';
import icons from '../icons';

var GeoLocationState = {
    NOT_STARTED: 0,
    RUNNING: 1,
    COMPLETE: 2,
    FAILED: 3,
};

var AutocompleteState = {
    NOT_SEARCHING: 0,
    SEARCHING: 1,
};

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
/*::`*/@reactMixin.decorate(Router.State)/*::`;*/
class LocationPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            geolocation: GeoLocationState.NOT_STARTED,
            autocompletion: AutocompleteState.NOT_SEARCHING,
            locationName: '',
            locationCoords: {},
            autocompletions: [],
        };
    }

    async locateMe(): Promise<Object> {
        var maps = await Maps();
        var location = await Location();
        var possibleLocations = await maps.geocode({
            location: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            },
        });
        /* store these coordinates for the session so we can use them to
         * provide additional info for autocomplete, distances, ISS search
         * weighting, etc. */
        sessionstorage.setItem('coordinates', JSON.stringify({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        }));

        /* return true if the types includes one of our interesting
         * component types */
        function interestingComponent(types: Array<string>): boolean {
            return !_.isEmpty(_.intersection(
                types,
                ['locality', 'administrative_area_level_1']
            ));
        }

        for (var geocodedLocation of possibleLocations) {
            if (_.contains(geocodedLocation.types, 'locality')) {
                /* build a location name from the address components specified
                 * in interestingComponent. We do this because we don't want
                 * to show all the parts of Google's formatted_address */
                var name = [
                    /*::`*/
                    for (component of geocodedLocation.address_components)
                    if (interestingComponent(component.types))
                        component.long_name
                    /*::`*/
                ].join(', ');

                return {
                    location: location,
                    name: name,
                };
            }
        }

        throw "Unable to determine your suburb";
    }

    onGeolocationTouchTap(): void {
        if (this.state.geolocation != GeoLocationState.NOT_STARTED) {
            return;
        }

        this.setState({
            geolocation: GeoLocationState.RUNNING,
        });

        this.locateMe()
            .then(params => {
                var { location, name } = params;

                this.setState({
                    geolocation: GeoLocationState.COMPLETE,
                    locationName: name,
                    locationCoords: location,
                });
            })

            .catch((e) => {
                console.error(e);
                this.setState({
                    geolocation: GeoLocationState.FAILED,
                    error: e.message,
                });
            });
    }

    onTouchDoneButton(event: Event): void {
        sessionstorage.setItem('location', this.state.locationName);
        this.replaceWith(this.getQuery().next);
    }

    /**
     * autoCompleteSuburb:
     * Take a search string and (optionally) the user's current location
     * and return a promise for an array of possible matches.
     */
    async autoCompleteSuburb(input: string, location: ?Object):
        Promise<Array<Object>>
    {
        var maps = await Maps();
        var request = {
            input: input,
            types: ['geocode'],
            componentRestrictions: {
                country: 'au',
            },
            location: null,
            radius: null,
        };

        /* If the user has coordinates set in this session, use them */
        try {
            var location = JSON.parse(sessionstorage.getItem('coordinates'));
            request.location = new maps.api.LatLng(location.latitude,
                                                   location.longitude);
            request.radius = 10000;  /* 10 km */
        } catch (e) {
        }

        console.log("Autocompleting", request);

        var completions = await maps.autocompletePlaces(request);

        return [
            /*::{_:`*/
            for (completion of completions)
            if (_.contains(completion.types, 'locality'))
            {
                suburb: completion.terms[0].value,
                state: completion.terms[1].value,
            }
            /*::`}*/
        ];
    }

    /**
     * triggerAutocomplete:
     *
     * Trigger an autocomplete after a 500ms debounce.
     */
    /*::__(){`*/@debounce(500)/*::`}*/
    triggerAutocomplete(input: string): void {
        this.autoCompleteSuburb(input, this.state.locationCoords)
            .then(results => {
                console.log("Done", results);
                this.setState({
                    autocompletions: results,
                    autocompletion: AutocompleteState.NOT_SEARCHING,
                });
            })

            .catch(() => {
                this.setState({
                    autocompletion: AutocompleteState.NOT_SEARCHING,
                });
            });
    }

    onSearchChange(event: Event): void {
        if (event.target instanceof HTMLInputElement) {
            this.setState({
                locationName: event.target.value,
                autocompletion: AutocompleteState.SEARCHING,
            });

            this.triggerAutocomplete(this.state.locationName);
        }
    }

    componentDidMount(): void {
        this.setState({
            locationName: sessionstorage.getItem('location'),
        });
    }

    render(): React.Element {
        return (
            <div className="LocationPage">
                <mui.AppBar
                    title="Personalise"
                    iconElementLeft={
                        <mui.IconButton
                            onTouchTap={this.goBack.bind(this)}
                        >
                            <NavigationArrowBack />
                        </mui.IconButton>
                    }
                />
                <HeaderBar
                    primaryText="Where are you?"
                    secondaryText={
                        "This will let me find the services closest to you"
                    }
                />
                <form
                    className="search"
                    onSubmit={this.onTouchDoneButton.bind(this)}
                >
                    <input
                        type="search"
                        placeholder="Enter a suburb or postcode"
                        value={this.state.locationName}
                        onChange={this.onSearchChange.bind(this)}
                    />
                </form>
                <mui.List>{
                    /* if the browser supports geolocation */
                    require('has-geolocation') &&
                    this.state.geolocation == GeoLocationState.NOT_STARTED ?
                        <mui.ListItem
                            onTouchTap={this.onGeolocationTouchTap.bind(this)}
                            primaryText="Get current location"
                            leftIcon={
                                <icons.Location
                                    className="ColoredIcon icon-fg-color"
                                />
                            }
                        />
                    : ''
                }{
                    this.state.geolocation == GeoLocationState.RUNNING ?
                        <mui.ListItem
                            primaryText="Locating you..."
                            secondaryText="Please permit us to use your GPS"
                            leftIcon={
                                <mui.CircularProgress
                                    className="ProgressIcon"
                                    mode="indeterminate"
                                    size={0.5}
                                />
                            }
                        />
                    : ''
                }{
                    this.state.geolocation == GeoLocationState.COMPLETE ?
                        <mui.ListItem
                            primaryText="Found your location"
                            leftIcon={<icons.Tick />}
                        />
                    : ''
                }{
                    this.state.geolocation == GeoLocationState.FAILED ?
                        <mui.ListItem
                            primaryText="Failed to find your location"
                            secondaryText={this.state.error}
                            leftIcon={<icons.Cross />}
                        />
                    : ''
                }{
                    /* any autocompletions we currently have */
                    this.state.autocompletions.map((result, index) =>
                        <mui.ListItem
                            key={index}
                            primaryText={
                                <div className="suburb">
                                    {result.suburb}
                                </div>
                            }
                            secondaryText={
                                <div className="state">
                                    {result.state}
                                </div>
                            }
                            onTouchTap={(event) => {
                                /* set the text box to this value
                                 * and remove the autocompletions */
                                var locationName =
                                    `${result.suburb}, ${result.state}`;

                                this.setState({
                                    locationName: locationName,
                                    autocompletions: [],
                                });
                            }}

                        />
                    )
                }</mui.List>
                {
                    this.state.autocompletion == AutocompleteState.SEARCHING ?
                        <div className="progress">
                            <mui.CircularProgress
                                mode="indeterminate"
                            />
                        </div>
                    : ''
                }
                <div className="done-button">
                    <mui.FlatButton
                        label="Done"
                        onTouchTap={this.onTouchDoneButton.bind(this)}
                    />
                </div>

            </div>
        );
    }

}

export default LocationPage;
