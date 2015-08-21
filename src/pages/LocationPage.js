/* @flow */

"use strict";

import React from 'react';
import _ from 'underscore';
import mui from "material-ui";

import Location from '../geolocation';
import Maps from '../maps';
import HeaderBar from '../components/HeaderBar';

class LocationPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            done: false,
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
                console.log(geocodedLocation.formatted_address);
                console.log(geocodedLocation.place_id);
                return {
                    // FIXME: we don't want the Australia
                    location: geocodedLocation.formatted_address,
                    place_id: geocodedLocation.place_id,
                };
            }
        }

        throw "Unable to locate";
    }

    componentDidMount(): void {
        this.locateMe()
            .then(data => {
                data.done = true;
                this.setState(data);
            });
    }

    render(): React.Element {
        return (
            <div>
                <mui.AppBar title="Personalise" />
                <HeaderBar
                    primaryText="Where are you?"
                    secondaryText={
                        "This will let me find the services closest to you"
                    }
                />
                {this.state.done ?
                    <div>It looks like you're in {this.state.location}.</div>
                :
                    <div>Locating you...</div>}
            </div>
        );
    }

}

export default LocationPage;
