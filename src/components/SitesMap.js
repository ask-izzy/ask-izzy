/* @flow */

import * as React from "react";
import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";

import type {Site} from "../iss";
import Maps from "../maps";
import type {MapsApi} from "../maps";
import storage from "../storage";
import routerContext from "../contexts/router-context";

type Props = {
    sites: Array<Site>,
    siteLocations: Object,
    onSiteSelect?: Function,
    selectedSite?: ?Site
}

type State = {
    coords?: ?{latitude: number, longitude: number},
    mapsApi: ?MapsApi,
}

type SiteMarker = {
    site: Site,
    point: issPoint,
    selected: boolean
}

export default class SitesMap extends React.Component<Props, State> {

    #mapElmRef = null;

    constructor(props: Object) {
        super(props);
        this.state = {
            mapsApi: null,
        };
    }

    static contextType = routerContext;

    componentDidMount(): void {
        this.setState({coords: storage.getCoordinates()});

        Maps().then(
            mapsApi => this.setState({mapsApi})
        );
    }

    async componentDidUpdate(prevProps: Object, prevState: Object) {
        if (
            this.state.mapsApi &&
            !this.sitesListMatch(this.props.sites, prevProps.sites)
        ) {
            this.setMapView(this.markersShownOnLoad)
        }
    }

    /**
     * Given two arrays of sites, check if both contain the same sites in the
     * same order
     * @param sitesA - A list of sites to be compared
     * @param sitesB - Another list of sites to be compared
     *
     * @returns True if they match, false if not
     */
    sitesListMatch(sitesA: Array<Site>, sitesB: Array<Site>) {
        if (sitesA.length !== sitesB.length) {
            return false
        }

        return sitesA.every((site, i) => site.id === sitesB[i].id)
    }

    /**
     * Get the Google Maps object.
     *
     * @returns {Promise} the Google Maps object.
     */
    getMap(): Promise<Object> { // FIXME: use actual type
        return new Promise((resolve, reject) => {
            let checkMaps = () => {
                if (this.#mapElmRef) {
                    resolve(this.#mapElmRef);
                } else {
                    setTimeout(checkMaps, 100);
                }
            }

            checkMaps();
        });
    }

    /**
     * Set the view position and zoom level of the map so the given markers are
     * shown.
     * @param markers - A list of markers to included in the map view
     *
     * @returns {void}
     */
    setMapView(markers: Array<SiteMarker>): void {
        if (!this.state.mapsApi || markers.length === 0) {
            // We'll call this method after the api is ready.
            return
        }
        const maps = this.state.mapsApi.api;
        const bounds = new maps.LatLngBounds();

        const points = markers.map(marker => marker.point)

        const centerPoint = points[0]

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
        // point remains in the center.
        for (const point of points) {
            const latDiff = centerPoint.lat - point.lat;
            const lonDiff = centerPoint.lon - point.lon;

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

    get markersShownOnLoad(): Array<SiteMarker> {
        if (this.markers.length === 0) {
            return []
        }
        // Select the first site to center map around
        const centerPoint = this.markers[0].point;

        return this.markers
            // Order points by increasing distance from the center point marker
            .sort((aMarker, bMarker) => {
                const aPoint = aMarker.point
                const bPoint = bMarker.point
                const aLatDiff = Math.abs(centerPoint.lat - aPoint.lat);
                const aLonDiff = Math.abs(centerPoint.lon - aPoint.lon);
                const bLatDiff = Math.abs(centerPoint.lat - bPoint.lat);
                const bLonDiff = Math.abs(centerPoint.lon - bPoint.lon);

                return (aLatDiff - bLatDiff) + (aLonDiff - bLonDiff);
            })
            // Limit to the 50% of markers closest to the center point marker
            .slice(0, Math.ceil(this.markers.length / 2))
            // Don't include markers further than 100km (approximated here as 1
            // lat/lon degree) from the center point marker.
            .filter(marker => {
                const latDiff = centerPoint.lat - marker.point.lat;
                const lonDiff = centerPoint.lon - marker.point.lon;
                return Math.abs(latDiff) <= 0.5 && Math.abs(lonDiff) <= 0.5
            })
    }

    get markers(): Array<SiteMarker> {
        return this.props.sites
            .filter(site => {
                if (this.props.siteLocations[site.id]?.point) {
                    return true
                }
                console.warn(
                    "SitesMap given a site without an associated location " +
                        "or lat/lon in the siteLocations prop:",
                    site
                )
                return false
            })
            .map(site => ({
                site,
                point: this.props.siteLocations[site.id].point,
                selected: site.id === this.props.selectedSite?.id,
            }))
    }

    onGoogleMapMount(mapElm: Object) {
        if (!mapElm) {
            return null
        }
        const initalMount = !this.#mapElmRef
        this.#mapElmRef = mapElm;
        if (initalMount) {
            this.setMapView(this.markersShownOnLoad);
        }
    }

    render() {
        const WrappedMap = this.WrappedMap
        return (
            <div className="SitesMap">
                {this.state.mapsApi && // Only render map after API has loaded
                    <WrappedMap
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `100%` }} />}
                        mapElement={<div style={{ height: "100%" }} />}
                    />
                }
            </div>
        );
    }

    WrappedMap = withGoogleMap(() => (
        <GoogleMap
            ref={this.onGoogleMapMount.bind(this)}
            defaultCenter={{
                lat: -34.397,
                lng: 150.644,
            }}
            options={{disableDefaultUI: true, zoomControl: true}}
            defaultZoom={12}
            onClick={() => this.props.onSiteSelect?.(null)}
        >
            {this.state.coords &&
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
            }
            {this.markers.map(marker =>
                <Marker
                    key={marker.site.id.toString()}
                    title={marker.site.name}
                    position={{
                        lat: marker.point.lat,
                        lng: marker.point.lon,
                    }}
                    icon={{
                        url: marker.selected ?
                            "/static/images/map-marker-with-dot.png"
                            : "/static/images/map-marker.png",
                        scaledSize: {width: 27, height: 43},
                    }}
                    onClick={() => this.props.onSiteSelect?.(marker.site)}
                />
            )}
        </GoogleMap>
    ))
}