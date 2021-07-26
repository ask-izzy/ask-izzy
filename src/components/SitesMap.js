/* @flow */

import * as React from "react";
import {GoogleMap, Marker} from "@react-google-maps/api"

import type {Site} from "../iss";
import Maps from "../maps";
import type {MapsApi} from "../maps";
import storage from "../storage";
import routerContext from "../contexts/router-context";
import {
    setMapView,
    markersShownOnLoad,
} from "./SitesMap.service";

type Props = {
    sites: Array<Site>,
    siteLocations: Object,
    onSiteSelect?: Function,
    selectedSite?: ?Site
}

type State = {
    coords?: ?{ latitude: number, longitude: number },
    mapsApi: ?MapsApi,
    map?: ?any,
}

type SiteMarker = {
    site: Site,
    point: issPoint,
    selected: boolean
}

export default class SitesMap extends React.Component<Props, State> {

    constructor(props: Object) {
        super(props);
        this.state = {
            mapsApi: null,
            maps: null,
            map: null,
        };
    }

    static contextType: any = routerContext;

    componentDidMount(): void {
        this.setState({coords: storage.getCoordinates()});

        Maps().then(
            mapsApi => {
                this.setState({mapsApi})
            },
        );
    }


    async componentDidUpdate(prevProps: Object, prevState: Object) {
        if (
            this.state.mapsApi && this.state.map &&
            !this.sitesListMatch(this.props.sites, prevProps.sites)
        ) {
            setMapView(
                markersShownOnLoad(this.markers),
                this.state.map,
                this.state.mapsApi,
            );
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
    sitesListMatch(sitesA: Array<Site>, sitesB: Array<Site>): boolean {
        if (sitesA.length !== sitesB.length) {
            return false
        }

        return sitesA.every((site, i) => site.id === sitesB[i].id)
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


    render(): React.Element<"div"> {
        return (
            <div className="SitesMap">
                {this.state.mapsApi ?
                    <GoogleMap
                        onLoad={(map) => {
                            this.setState({map})
                            setMapView(
                                markersShownOnLoad(this.markers),
                                map,
                                this.state.mapsApi,
                            );
                        }}

                        mapContainerStyle={{height: "100%"}}
                        options={{disableDefaultUI: true, zoomControl: true }}
                        zoom={12}
                        onClick={() => this.props.onSiteSelect?.(null)}
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
                            : null}
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
                                onClick={() =>
                                this.props.onSiteSelect?.(marker.site)}
                            />)}
                    </GoogleMap>
                    : <div style={{
                        textAlign: "center",
                    }}>
                        <h3>
                            The map couldn't be loaded, please refresh the page
                        </h3>
                    </div>}
            </div>
        );
    }
}

