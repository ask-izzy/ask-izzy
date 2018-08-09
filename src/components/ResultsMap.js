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
        const points = removeOutliers(
            _.compact(this.services().map(
                (service) => service.location ? service.location.point : null
            ))
        )

        for (let point of points) {
            bounds.extend(new maps.LatLng(point.lat, point.lon));
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

// what I really want here is something to figure
// out how far out to draw the bounding box.
// one idea: grab the closest 50% of points,
// then grow to include any 'nearby' (twice as far)
// then repeat until no more are getting added.
export function removeOutliers(
    points: Array<issPoint>
): Array<issPoint> {
    // Remove duplicate points
    points = _.uniq(points, false, ({lat, lon}) => `${lat}:${lon}`);

    // Outliers don't help if there are few points.
    if (points.length <= 2) {
        return points;
    }

    points = points.map(normalizePoint);
    // start with the 50% of the points closest to the centre
    return expandCluster(
        _(points)
            .sortBy(distanceFrom(centreOf(points)))
            .slice(0, Math.ceil(points.length / 2)),
        points
    ).map(denormalizePoint);
}

// Floating points are inaccurate for small differences between large numbers.
// This function adjusts points in AU to reduce loss of accuracy.
export function normalizePoint(point: issPoint): issPoint {
    return {lat: point.lat + 25, lon: point.lon - 133}
}

export function denormalizePoint(point: issPoint): issPoint {
    return {lat: point.lat - 25, lon: point.lon + 133}
}

export function expandCluster(
    approxCluster: Array<issPoint>,
    points: Array<issPoint>,
): Array<issPoint> {
    const approxClusterCentre = centreOf(approxCluster);

    // The furthest-from-centre entry in approxCluster
    // is a good starting distance to ensure we can't
    // shrink the cluster
    let initialDistance = distance(
        approxClusterCentre,
        _(_(approxCluster).sortBy(distanceFrom(approxClusterCentre))).last(),
    );

    // Add anything within 4x the distance (analagous to
    // zooming out two levels on a webmercator map)
    const newCluster = _(points).filter((point) =>
        distance(approxClusterCentre, point) <= (initialDistance * 4)
    )

    // Recurse until we stop growing the cluster.
    if (!_.isEqual(newCluster, approxCluster)) {
        if (newCluster.length < approxCluster.length) {
            if (process.env.NODE_ENV == "development") {
                throw new Error("Assertion error: " +
                    "expandCluster reduced the number of pins"
                );
            } else {
                // If things go wrong in prod,
                // give the user something reasonable.
                return approxCluster;
            }
        }
        return expandCluster(newCluster, points);
    } else {
        return approxCluster;
    }
}

export function centreOf(points: Array<issPoint>): issPoint {
    if (points.length == 0) {
        if (process.env.NODE_ENV == "development") {
            throw new Error("Assertion error: " +
                "no points passed to centreOf(points)"
            );
        }
    }
    let centre = {lat: 0, lon: 0};

    points.forEach(({lat, lon}) => {
        centre.lat += lat / points.length;
        centre.lon += lon / points.length;
    });
    return centre;
}

export function distance(start: issPoint, end: issPoint): number {
    return Math.sqrt(
        Math.pow(Math.abs(start.lat - end.lat), 2) +
        Math.pow(Math.abs(start.lon - end.lon), 2)
    );
}

export function distanceFrom(end: issPoint): Function {
    return (start: issPoint) => {
        return distance(start, end)
    };
}
