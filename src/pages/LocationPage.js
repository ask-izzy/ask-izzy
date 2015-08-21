/* @flow */

"use strict";

import React from 'react';
import _ from 'underscore';
import mui from "material-ui";

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

        for (var geocodedLocation of possibleLocations) {
            if (_.contains(geocodedLocation.types, 'locality')) {
                return {
                    location: location,

                    // FIXME: we don't want the Australia, instead we
                    // want a postcode
                    name: geocodedLocation.formatted_address,
                };
            }
        }

        throw "Unable to locate";
    }

    onGeolocationTouchTap(): void {
        console.log(this);
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

            .catch(() => {
                this.setState({
                    geolocation: GeoLocationState.FAILED,
                });
            });
    }

    componentDidMount(): void {
    }

    render(): React.Element {
        return (
            <div className="LocationPage">
                <mui.AppBar title="Personalise" />
                <HeaderBar
                    primaryText="Where are you?"
                    secondaryText={
                        "This will let me find the services closest to you"
                    }
                />
                <div className="search">
                    <input
                        type="search"
                        placeholder="Enter a suburb or postcode"
                        value={this.state.locationName}
                    />
                </div>
                <mui.List>
                {
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
                }
                {
                    this.state.geolocation == GeoLocationState.RUNNING ?
                        <mui.ListItem
                            primaryText="Locating you..."
                            secondaryText="Please permit us to use your GPS"
                        />
                    : ''
                }
                {
                    this.state.geolocation == GeoLocationState.COMPLETE ?
                        <mui.ListItem
                            primaryText="Found your location"
                            leftIcon={<icons.Tick />}
                        />
                    : ''
                }
                {
                    this.state.geolocation == GeoLocationState.FAILED ?
                        <mui.ListItem
                            primaryText="Failed to find your location"
                            secondaryText="FIXME REASON"
                            leftIcon={<icons.Cross />}
                        />
                    : ''
                }
                </mui.List>
            </div>
        );
    }

}

export default LocationPage;
