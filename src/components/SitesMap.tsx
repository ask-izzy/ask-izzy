import React, {useEffect, useState} from "react";
import {GoogleMap, Marker} from "@react-google-maps/api"

import type {site} from "@/src/iss/site";
import type {geoPoint} from "@/src/iss/general"
import Maps from "@/src/maps";
import storage from "@/src/storage";
import * as gtm from "@/src/google-tag-manager";
import {
    setMapView,
    markersShownOnLoad,
} from "@/src/components/SitesMap.service.js";

type Props = {
    sites: Array<site>,
    siteLocations: Record<string, any>,
    onSiteSelect?: (site: site | null) => void,
    selectedSite?: site | null,
}


type SiteMarker = {
    site: site,
    point: geoPoint,
    selected: boolean
}

function SitesMap({
    sites,
    siteLocations,
    onSiteSelect,
    selectedSite,
}: Props) {

    const [mapsApi, setMapsApi] = useState<any>(null)
    const [map, setMap] = useState<any>(null)

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
                    if (siteLocations[site.id]?.point) {
                        return true
                    }
                    console.warn(
                        "SitesMap given a site without an" +
                        " associated location " +
                        "or lat/lon in the siteLocations prop:",
                        site,
                    )
                    return false
                })
                .map(site => ({
                    site,
                    point: siteLocations[site.id].point,
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
                                scaledSize: {width: 32, height: 32},
                            } as any}
                            position={{
                                lat: storage.getUserGeolocation()?.latitude,
                                lng: storage.getUserGeolocation()?.longitude,
                            } as any}
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
                                scaledSize: {width: 27, height: 43},
                            } as any}
                            onClick={() => markerOnClickHandler(marker)}
                        />,
                    )}
                </GoogleMap>
                : <div style={{
                    textAlign: "center",
                }}>
                    <h3>
                        The map couldn&apos;t be loaded, please refresh the page
                    </h3>
                </div>}
        </div>
    );
}

export default SitesMap

