import type {ReactNode} from "react";
import * as React from "react";
import {GoogleMap, Marker} from "@react-google-maps/api"

import type {site} from "../iss/site";
import type {geoPoint} from "../iss/general"
import Maps from "../maps";
import storage from "../storage";
import * as gtm from "../google-tag-manager";
import {
    setMapView,
    markersShownOnLoad,
} from "./SitesMap.service";
import {useEffect, useState} from "react";

type Props = {
    sites: Array<site>,
    siteLocations: any,
    onSiteSelect?: Function,
    selectedSite?: site | null | undefined
}


type SiteMarker = {
    site: site,
    point: geoPoint,
    selected: boolean
}

function SitesMap(
    {
        sites,
        siteLocations,
        onSiteSelect,
        selectedSite,
    }: Props): ReactNode {

    const [mapsApi, setMapsApi] = useState(null)
    const [map, setMap] = useState(null)

    useEffect(() => {
        Maps().then(mapsApi => setMapsApi(mapsApi))
    }, [])

    useEffect(() => {
        const setMap = async() => {
            if (
                mapsApi && map &&
                !sites?.every((site, i) => site.id === sites?.[i].id)
            ) {
                setMapView(
                    markersShownOnLoad(markers()),
                    map,
                    mapsApi,
                );
            }
        }
        if (sites) {
            setMap()
        }

    }, [sites])


    const markers = (): Array<SiteMarker> => {
        if (sites?.length) {
            return sites?.filter(
                site => {
                    if (siteLocations[site.id]?.geo_point) {
                        return true
                    }
                    console.warn(
                        "SitesMap given a site without an" +
                        " associated location " +
                        "or lat/lon in the siteLocations prop:",
                        site
                    )
                    return false
                })
                .map(site => ({
                    site,
                    point: siteLocations[site.id].geo_point,
                    selected: site.id === selectedSite?.id,
                }))
        }
        return []
    }

    const markerOnClickHandler = (marker: SiteMarker) => {
        gtm.emit({
            event: `Action Triggered - Map Marker`,
            eventCat: "Action triggered",
            eventAction: `Map marker`,
            eventLabel: marker.site.id.toString(),
            sendDirectlyToGA: true,
        });
        onSiteSelect?.(marker.site)
    }

    return (
        <div className="SitesMap">
            {mapsApi ?
                <GoogleMap
                    onLoad={(map) => {
                        setMap(map)
                        setMapView(
                            markersShownOnLoad(markers()),
                            map,
                            mapsApi,
                        );
                    }}

                    mapContainerStyle={{height: "100%"}}
                    options={{
                        disableDefaultUI: true,
                        zoomControl: true,
                    }}
                    zoom={12}
                    onClick={() => onSiteSelect?.(null)}
                >
                    {storage.getUserGeolocation() ?
                        <Marker
                            title="You are here"
                            icon={{
                                url: "/images/you-are-here.png",
                                scaledSize: {width: 32, height: 32} as google.maps.Size,
                            }}
                            position={{
                                lat: storage.getUserGeolocation()?.latitude,
                                lng: storage.getUserGeolocation()?.longitude,
                            }}
                        />
                        : null}
                    {markers().map(marker =>
                        <Marker
                            key={marker.site.id.toString()}
                            title={marker.site.name}
                            position={{
                                lat: marker.point.lat,
                                lng: marker.point.lon,
                            }}
                            icon={{
                                url: marker.selected ?
                                    "/images/map-marker-with-dot.png"
                                    : "/images/map-marker.png",
                                scaledSize: {width: 27, height: 43} as google.maps.Size,
                            }}
                            onClick={() => markerOnClickHandler(marker)}
                        />
                    )}
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

export default SitesMap

