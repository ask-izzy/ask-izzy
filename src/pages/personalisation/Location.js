/* @flow */

"use strict";

import React from 'react';
import Router from "react-router";
import _ from 'underscore';
import mui from "material-ui";
import reactMixin from "react-mixin";
import sessionstorage from "sessionstorage";
import { debounce } from "core-decorators";
import { ltrim } from "underscore.string";

import Location from '../../geolocation';
import Maps from '../../maps';
import Personalisation from '../../mixins/Personalisation';
import components from '../../components';
import icons from '../../icons';
import * as iss from '../../iss';

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
/*::`*/@reactMixin.decorate(Personalisation)/*::`;*/
class LocationPersonalisation extends React.Component {
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

    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
        /* Coordinates are optional */
        try {
            var coords =
                JSON.parse(sessionstorage.getItem('coordinates'));
            request = Object.assign(request, {
                location: `${coords.longitude}E${coords.latitude}N`,
            });
        } catch (e) {
        }

        /* Location/Area is required */
        var location = sessionstorage.getItem('location');

        if (location) {
            return Object.assign(request, {
                area: location,
            });
        } else {
            return null;
        }
    }

    // flow:disable
    static summaryLabel = "Where are you?";

    // flow:disable
    static get summaryValue(): string {
        return sessionstorage.getItem('location');
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
        event.preventDefault();
        sessionstorage.setItem('location', this.state.locationName);
        this.nextStep();
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
        var request: AutocompletionRequest = {
            input: input,
            types: ['geocode'],
            componentRestrictions: {
                country: 'au',
            },
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
                locationName: ltrim(event.target.value),
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
            <div>
                <components.HeaderBar
                    primaryText={
                        <div>
                            Where are you?
                            <icons.LogoLight className="Logo" />
                        </div>
                    }
                    secondaryText={
                        "This will let me find the services closest to you"
                    }
                />
                <mui.List className="List">{
                    /* if the browser supports geolocation */
                    require('has-geolocation') &&
                    this.state.geolocation == GeoLocationState.NOT_STARTED ?
                        <mui.ListItem
                            className="taller ListItem"
                            onTouchTap={this.onGeolocationTouchTap.bind(this)}
                            primaryText="Get current location"
                            leftIcon={
                                <icons.Location
                                    className="ColoredIcon icon-fg-color"
                                />
                            }

                            disableFocusRipple={true}
                            disableTouchRipple={true}
                        />
                    : ''
                }{
                    this.state.geolocation == GeoLocationState.RUNNING ?
                        <mui.ListItem
                            className="ListItem"
                            primaryText="Locating you..."
                            secondaryText="Please permit us to use your GPS"
                            leftIcon={
                                <mui.CircularProgress
                                    className="ProgressIcon"
                                    mode="indeterminate"
                                    size={0.5}
                                />
                            }

                            disableFocusRipple={true}
                            disableTouchRipple={true}
                        />
                    : ''
                }{
                    this.state.geolocation == GeoLocationState.COMPLETE ?
                        <mui.ListItem
                            className="taller ListItem"
                            primaryText="Found your location"
                            leftIcon={<icons.Tick />}

                            disableFocusRipple={true}
                            disableTouchRipple={true}
                        />
                    : ''
                }{
                    this.state.geolocation == GeoLocationState.FAILED ?
                        <mui.ListItem
                            className="ListItem"
                            primaryText="Unable to get your location"
                            secondaryText={`Please enter your location below
                                (${this.state.error})`}
                            leftIcon={<icons.Cross />}

                            disableFocusRipple={true}
                            disableTouchRipple={true}
                        />
                    : ''
                }
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
                {
                    /* any autocompletions we currently have */
                    this.state.autocompletions.map((result, index) =>
                        <mui.ListItem
                            className="ListItem"
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
                            leftIcon={<icons.RadioUnselected />}
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

                            disableFocusRipple={true}
                            disableTouchRipple={true}
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
                        disabled={(!this.state.locationName)}
                        onTouchTap={this.onTouchDoneButton.bind(this)}
                    />
                </div>

            </div>
        );
    }

}

export default LocationPersonalisation;
