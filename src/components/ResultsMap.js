/* @flow */

import * as React from "react";
import PropTypes from "proptypes";
import _ from "underscore";
import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";

import iss from "../iss";
import type {Service} from "../iss";
import Maps from "../maps";
import type {MapsApi} from "../maps";
import ResultsList from "./ResultsList";
import storage from "../storage";

type Props = {
    objects: Array<Object>,
    onServicesChange?: Function,
}

type State = {
    coords?: ?{latitude: number, longitude: number},
    selectedServices?: Array<Service>,
    maps?: MapsApi,
}

class ResultsMap extends React.Component<Props, State> {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    _map: any;

    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        this.setState({coords: storage.getCoordinates()});

        // TODO: Use the react-google-maps ref-callback
        // approach, so that
        /* request the Google Maps API */
        Maps().then((maps) => {
            this.setState({maps: maps});
            // disable infowindows
            // flow:disable blithely monkey-patch the global gmaps api :(
            maps.api.InfoWindow.prototype.set = function() {};
        });
    }

    componentDidUpdate(prevProps: Object, prevState: Object) {
        if ((this.state.maps != prevState.maps) ||
            (this.props.objects != prevProps.objects)) {
            if (this.services().length) {
                // N.B. getMap() returns a different promise each time, so
                // there's no guarantee that the most recently set bounds
                // will be the ones applied.
                // As a result we need to check whether any services have
                // loaded before setting bounds (so that only one attempt
                // is made to set the bounds) - preventing a race condition.
                // react-google-maps has a callback-based interface now,
                // which avoids this issue.
                this.showWholeMap();
            }
        }
    }

    clearSelection(): void {
        if (this.state.selectedServices) {
            this.setState({selectedServices: []});
            if (this.props.onServicesChange) {
                this.props.onServicesChange([]);
            }
        }
    }

    /**
     * Get the Google Maps object.
     *
     * @returns {Promise} the Google Maps object.
     */
    getMap(): Promise<Object> { // FIXME: use actual type
        const map = this._map;

        return new Promise((resolve, reject) => {
            function checkMaps() {
                if (map) {
                    resolve(map);
                } else {
                    setTimeout(checkMaps, 500);
                }
            }

            checkMaps();
        });
    }

    services(): Array<iss.Service> {
        if (!this.props.objects) {
            return [];
        }

        return this.props.objects.filter(
            (service) => !service.Location().isConfidential()
        );
    }

    get sites(): Array<Array<iss.Service>> {
        return _.values(_.groupBy(
            this.services(),
            obj => obj.site.id
        ));
    }

    /**
     * Adjust the bounds to show the whole map
     *
     * @returns {void}
     */
    showWholeMap(): void {
        /* update the map bounds */
        if (!this.state.maps) {
            // We'll call this method after the api is ready.
            return
        }
        const maps = this.state.maps.api;
        let bounds = new maps.LatLngBounds();

        // Get the location of every service which has a location and is not a
        // crisis line.
        let points = _.compact(this.services()
            .map(
                (service) => service.location && !service.crisis ?
                    service.location.point : null
            )
        )

        // Select the top result from the list of points to center map around
        const centerPoint = points[0];

        // Order points by distance from centerPoint and then remove the
        // furthest 50%
        points = points.sort((aPoint: issPoint, bPoint: issPoint) => {
            let aLatDiff = Math.abs(centerPoint.lat - aPoint.lat);
            let aLonDiff = Math.abs(centerPoint.lon - aPoint.lon);
            let bLatDiff = Math.abs(centerPoint.lat - bPoint.lat);
            let bLonDiff = Math.abs(centerPoint.lon - bPoint.lon);

            return (aLatDiff - bLatDiff) + (aLonDiff - bLonDiff);
        }).splice(0, Math.ceil(points.length / 2));

        // Add two points to create a maximum possible level of zoom
        let maxZoom = 0.002; // about 0.5km

        bounds.extend(new maps.LatLng(
            centerPoint.lat + (maxZoom / 2),
            centerPoint.lon + (maxZoom / 2)
        ));
        bounds.extend(new maps.LatLng(
            centerPoint.lat - (maxZoom / 2),
            centerPoint.lon - (maxZoom / 2)
        ));

        // Loop though points and add to bounding box used for setting initial
        // map view. For each point add another point that's exactly opposite
        // when compared to the center point. This ensures that the center
        // point remains in the center. Stop adding points if bounding box gets
        // becomes larger than 100km (approximated by 1 lat/lon degree).
        for (let point of points) {
            let latDiff = centerPoint.lat - point.lat;
            let lonDiff = centerPoint.lon - point.lon;

            if (Math.abs(latDiff) > 0.5 || Math.abs(lonDiff) > 0.5) {
                break
            }
            bounds.extend(new maps.LatLng(point.lat, point.lon));
            bounds.extend(new maps.LatLng(
                centerPoint.lat + latDiff,
                centerPoint.lon + lonDiff
            ));
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
        if (this.props.onServicesChange) {
            this.props.onServicesChange(services);
        }
    }

    onGoBack(event: SyntheticInputEvent<>): void {
        event.preventDefault()
        if (!_.isEmpty(this.state.selectedServices)) {
            this.clearSelection();
        } else {
            this.context.router.goBack();
        }
    }

    render() {
        const selectedServices = this.state.selectedServices || [];

        return (
            <div className="ResultsMap">
                { /* we can't create the map component until the API promise
                     * resolves */
                    this.state.maps && this.renderMap()
                }
                <ResultsList
                    results={selectedServices}
                />
            </div>
        );
    }

    renderMap() {

        return (
            <GoogleMap
                ref={elem => {
                    this._map = elem
                }}
                defaultCenter={{
                    lat: -34.397,
                    lng: 150.644,
                }}
                options={{disableDefaultUI: true, zoomControl: true}}
                defaultZoom={12}
                onClick={this.onMapClick.bind(this)}
            >
                {
                    this.state.coords && (
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
                    )
                }
                {
                    this.sites.map((objects, index) => {
                        /* the site must have a public location */
                        // eslint-disable-next-line max-len
                        const point = objects[0].location ? objects[0].location.point : null;

                        return point && (
                            <Marker
                                key={index}
                                title={objects[0].site.name}
                                position={{
                                    lat: point.lat,
                                    lng: point.lon,
                                }}
                                onClick={this.onMarkerClick.bind(this, objects)}
                            />
                        )
                    })
                }
            </GoogleMap>
        );
    }
}

export default withGoogleMap(ResultsMap);