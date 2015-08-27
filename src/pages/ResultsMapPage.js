/* @flow */

"use strict";

import { GoogleMap, Marker, InfoWindow } from "react-google-maps";
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

    /**
     * showWholeMap:
     * Adjust the bounds to show the whole map
     */
    showWholeMap(): void {
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

    componentDidUpdate(prevProps: Object, prevState: Object) {
        if (this.state.maps &&
            this.state.objects &&
            this.state.objects.length)
        {
            this.showWholeMap();
        }
    }

    onMapClick(): void {
        if (this.state.selectedService) {
            this.setState({selectedService: null});
            this.showWholeMap();
        }
    }

    onMarkerClick(service: Object): void {
        console.log("service clicked", service);
        this.setState({selectedService: service});
        this.getMap().then(map => {
            map.setCenter({
                lat: service.location.point.lat,
                lng: service.location.point.lon,
            });
            map.setZoom(18);
        });
    }

    render(): React.Element {
        var mapHeight = 0;

        try {
            /* calculate the height of the map */
            mapHeight =
                document.querySelector('.BrandedPage').offsetHeight -
                document.querySelector('.AppBar').offsetHeight;

            if (mapHeight > 700) {
                /* we have space for the footer */
                mapHeight -= document.querySelector('footer').offsetHeight;
            }
        } catch (e) {
        }

        console.log("map height", mapHeight);

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
                {   /* we can't create the map component until the API promise
                     * resolves */
                    this.state.maps ?
                        <GoogleMap
                            ref="map"
                            containerProps={{
                                style: {
                                    height: mapHeight,
                                },
                            }}
                            defaultCenter={{
                                lat: -34.397,
                                lng: 150.644,
                            }}
                            defaultZoom={4}
                            onClick={this.onMapClick.bind(this)}
                        >
                            {(this.state.objects || []).map(
                                /* FIXME: need to combine markers at same
                                 * coordinates */
                                (object, index) => <Marker
                                    key={index}
                                    position={{
                                        lat: object.location.point.lat,
                                        lng: object.location.point.lon,
                                    }}
                                    onClick={this.onMarkerClick.bind(this,
                                                                     object)}
                                />
                            )}
                        </GoogleMap>
                    : ''
                }
                <mui.List className="List">{
                    this.state.selectedService ?
                        <ResultListItem object={this.state.selectedService} />
                    : ''
                }</mui.List>
            </div>
        );
    }

}

export default ResultsMapPage;
