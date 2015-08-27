/* @flow */

"use strict";

import { GoogleMap, Marker } from "react-google-maps";
import React from 'react';
import Router from "react-router";
import NavigationArrowBack from
    "material-ui/lib/svg-icons/navigation/arrow-back";
import mui from "material-ui";

import BaseResultsPage from "./BaseResultsPage";
import HeaderBar from '../components/HeaderBar';
import ResultListItem from '../components/ResultListItem';
import Maps from '../maps';

class ResultsMapPage extends BaseResultsPage {
    componentDidMount(): void {
        super.componentDidMount();

        /* request the Google Maps API */
        Maps().then((maps) => {
            this.setState({maps: maps});
        });
    }

    /**
     * fitBounds:
     *
     * Fit the map to bounds.
     * This is requires a lot of things, so return a promise when it is done.
     */
    getMap(): Promise<Object> {  // FIXME: use actual type
        var map = this.refs.map;

        return new Promise((resolve, reject) => {
            function checkMaps() {
                if (map.state.map) {
                    resolve(map.state.map);
                } else {
                    setTimeout(checkMaps, 500);
                }
            }

            checkMaps();
        });
    }

    componentDidUpdate(prevProps: Object, prevState: Object) {
        if (this.state.maps && this.state.objects.length) {
            /* update the map bounds */
            var maps = this.state.maps.api;
            var bounds = new maps.LatLngBounds;

            for (var object of this.state.objects) {
                bounds.extend(new maps.LatLng(object.location.point.lat,
                                              object.location.point.lon));
            }

            this.getMap().then(map => {
                map.fitBounds(bounds);
            });
        }
    }

    render(): React.Element {
        return (
            <div className="ResultsMapPage">
                <mui.AppBar
                    className="AppBar"
                    title={this.title}
                    iconElementLeft={
                        <mui.IconButton
                            className="BackButton"
                            onTouchTap={this.goBack.bind(this)}
                        >
                            <NavigationArrowBack />
                        </mui.IconButton>
                    }
                />
                <div className="Map">{
                    /* we can't create the map component until the API promise
                     * resolves */
                    this.state.maps ?
                        <GoogleMap
                            ref="map"
                            defaultCenter={{
                                lat: -34.397,
                                lng: 150.644,
                            }}
                            defaultZoom={4}
                        >
                            {this.state.objects.map(
                                object => <Marker
                                    position={{
                                        lat: object.location.point.lat,
                                        lng: object.location.point.lon,
                                    }}
                                />
                            )}
                        </GoogleMap>
                    : ''
                }</div>
            </div>
        );
    }

}

export default ResultsMapPage;
