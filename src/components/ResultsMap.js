/* @flow */

import React from "react";
import _ from "underscore";
import { GoogleMap, Marker } from "react-google-maps";

import iss from "../iss";
import Maps from "../maps";
import ResultsList from "./ResultsList";
import storage from "../storage";

class ResultsMap extends React.Component {

    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        this.setState({coords: storage.getCoordinates()});

        /* request the Google Maps API */
        Maps().then((maps) => {
            this.setState({maps: maps});

            // disable infowindows
            maps.api.InfoWindow.prototype.set = function() {};

        });
    }

    componentDidUpdate(prevProps: Object, prevState: Object) {
        if (this.state.maps &&
            !_.isEmpty(this.props.objects)) {
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
        const map = this.refs.map;

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

    get sites(): Array<Array<iss.Service>> {
        if (!this.props.objects) {
            return [];
        } else if (this._sites) {
            return this._sites;
        } else {
            this._sites = _.values(_.groupBy(this.props.objects,
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
        const maps = this.state.maps.api;
        let bounds = new maps.LatLngBounds();

        for (let object of this.props.objects) {
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
        this.setState({selectedServices: services});
    }

    onGoBack(event: SyntheticInputEvent): void {
        event.preventDefault()
        if (!_.isEmpty(this.state.selectedServices)) {
            this.clearSelection();
        } else {
            this.props.history.goBack();
        }
    }

    render(): ReactElement {
        const selectedServices = this.state.selectedServices || [];

        return (
            <div className="ResultsMap">
                {   /* we can't create the map component until the API promise
                     * resolves */
                    this.state.maps ? this.renderMap() : ""
                }
                <ResultsList
                    results={selectedServices}
                />
            </div>
        );
    }

    renderMap(): ReactElement {
        let selectedServices = this.state.selectedServices || [];
        let mapHeight = 0;

        try {
            /* calculate the height of the map */
            mapHeight =
                window.innerHeight -
                document.querySelector(".AppBar").offsetHeight;

            /* resize the map to make room
             * for the selected results */
            mapHeight -= 150 * selectedServices.length;

            /* limit minimum height to 1/2 of the screen realestate */
            mapHeight = Math.max(mapHeight,
                                 window.innerHeight / 2);
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
                options={{disableDefaultUI: true, zoomControl: true}}
                defaultZoom={4}
                onClick={this.onMapClick.bind(this)}
            >
                {this.state.coords ?
                <Marker
                    title="You are here"
                    icon={{
                        url: "/static/images/you-are-here.png",
                        scaledSize: {width: 32, height: 32},
                    }}
                    position={{
                        lat: this.state.coords.latitude,
                        lng: this.state.coords.longitude,
                    }}
                />
                : ""
                }
                {this.sites.map((objects, index) =>
                    /* the site must have a public location */
                    objects[0].location.point ?
                        <Marker
                            key={index}
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

export default ResultsMap;
