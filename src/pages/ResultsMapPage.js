/* @flow */

import React from "react";
import _ from "underscore";
import mui from "material-ui";
import { GoogleMap, Marker } from "react-google-maps";

import iss from "../iss";
import BaseResultsPage from "./BaseResultsPage";
import Maps from "../maps";
import ResultListItem from "../components/ResultListItem";
import components from "../components";

class ResultsMapPage extends BaseResultsPage {
    componentDidMount(): void {
        super.componentDidMount();

        /* request the Google Maps API */
        Maps().then((maps) => {
            this.setState({maps: maps});

            // disable infowindows
            maps.api.InfoWindow.prototype.set = function() {};

        });
    }

    componentDidUpdate(prevProps: Object, prevState: Object) {
        if (this.state.maps &&
            this.state.objects &&
            this.state.objects.length) {

            this.showWholeMap();
        }
    }

    clearSelection(): void {
        if (this.state.selectedServices) {
            this.setState({selectedServices: []});
            this.showWholeMap();
        }
    }

    /**
     * Get the Google Maps object.
     *
     * @returns {Promise} the Google Maps object.
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

    // flow:disable
    get sites(): Array<Array<iss.issService>> {
        if (!this.state.objects) {
            return [];
        } else if (this._sites) {
            return this._sites;
        } else {
            this._sites = _.values(_.groupBy(this.state.objects,
                                             obj => obj.site.id));
            return this._sites;
        }
    }

    /**
     * Adjust the bounds to show the whole map
     *
     * @returns {void}
     */
    showWholeMap(): void {
        /* update the map bounds */
        var maps = this.state.maps.api;
        var bounds = new maps.LatLngBounds();

        for (var object of this.state.objects) {
            if (object.location.point) {
                bounds.extend(new maps.LatLng(object.location.point.lat,
                                              object.location.point.lon));
            }
        }

        this.getMap().then(map => {
            map.fitBounds(bounds);
        });
    }

    onMapClick(): void {
        this.clearSelection();
    }

    onMarkerClick(services: Array<Object>): void {
        console.log("services", services);
        this.setState({selectedServices: services});
        this.getMap().then(map => {
            map.setCenter({
                lat: services[0].location.point.lat,
                lng: services[0].location.point.lon,
            });
            map.setZoom(18);
        });
    }

    onBackClick(): void {
        if (_.isEmpty(this.state.selectedServices)) {
            this.props.history.goBack();
        } else {
            this.clearSelection();
        }
    }

    render(): ReactElement {
        var selectedServices = this.state.selectedServices || [];

        return (
            <div className="ResultsMapPage">
                <components.AppBar
                    title={this.title}
                    onBackTouchTap={this.onBackClick.bind(this)}
                />
                {   /* we can't create the map component until the API promise
                     * resolves */
                    this.state.maps ? this.renderMap() : ""
                }
                <mui.List className="List">{
                    selectedServices.map((object, index) =>
                        <ResultListItem
                            key={index}
                            object={object}
                            nServiceProvisions={0}
                        />
                    )
                }</mui.List>
            </div>
        );
    }

    renderMap(): ReactElement {
        var selectedServices = this.state.selectedServices || [];
        var mapHeight = 0;

        try {
            /* calculate the height of the map */
            mapHeight =
                window.innerHeight -
                document.querySelector(".AppBar").offsetHeight;

            if (mapHeight > 900) {
                /* we have space for the footer, resize the map to either fit
                 * the footer or the selected results */
                mapHeight -= Math.max(
                    document.querySelector("footer").offsetHeight,
                    150 * selectedServices.length
                );
            } else {
                /* no space for the footer, but resize the map to make room
                 * for the selected results */
                mapHeight -= 150 * selectedServices.length;
            }

            /* limit minimum height to 1/3 of the screen realestate */
            mapHeight = Math.max(mapHeight,
                                 window.innerHeight / 3);
        } catch (error) {
            console.error(error);
        }

        return (
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
                {this.sites.map((objects, index) =>
                    /* the site must have a public location */
                    objects[0].location.point ?
                        <Marker
                            key={index}
                            label={String(objects.length)}
                            title={objects[0].site.name}
                            position={{
                                lat: objects[0].location.point.lat,
                                lng: objects[0].location.point.lon,
                            }}
                            onClick={this.onMarkerClick.bind(this, objects)}
                        />
                    : ""
                )}
            </GoogleMap>
        );
    }
}

export default ResultsMapPage;
