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

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
/*::`*/@reactMixin.decorate(Router.State)/*::`;*/
class LocationPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            geolocation: GeoLocationState.NOT_STARTED,
            locationName: '',
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
                        component.short_name
                    /*::`*/
                ].join(' ');

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

    onSearchChange(event: Event): void {
        if (event.target instanceof HTMLInputElement) {
            this.setState({
                locationName: event.target.value,
            });
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
                    className="AppBar"
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
                }</mui.List>
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
