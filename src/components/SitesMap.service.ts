import type {site} from "@/src/iss/site.js";
import {MapsApi} from "@/src/maps.js";
import type {geoPoint} from "@/src/iss/general.js"

type SiteMarker = {
    site: site,
    point: geoPoint,
    selected: boolean
}

export const markersShownOnLoad = (
    markers: Array<SiteMarker>,
): Array<SiteMarker> => {
    if (markers.length === 0) {
        return []
    }
    // Select the first site to center map around
    const centerPoint = markers[0].point;

    return markers
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
        .slice(0, Math.ceil(markers.length / 2))
        // Don't include markers further than 100km (approximated here as 1
        // lat/lon degree) from the center point marker.
        .filter(marker => {
            const latDiff = centerPoint.lat - marker.point.lat;
            const lonDiff = centerPoint.lon - marker.point.lon;
            return Math.abs(latDiff) <= 0.5 && Math.abs(lonDiff) <= 0.5
        })
}


/**
 * Set the view position and zoom level of the map so the given markers are
 * shown.
 * @param markers - A list of markers to included in the map view
 * @param map - the map reference
 * @param mapsAPI - the maps api
 *
 * @return void
 */
export const setMapView = (
    markers: Array<SiteMarker>,
    map: any, // can't use googleMaps type because it doesn't have fitBoudns
    mapsAPI: MapsApi | null,
): void => {
    if (!mapsAPI || markers.length === 0) {
        // We'll call this method after the api is ready.
        // this is set to Uluru
        map.setCenter({
            lat: -25.3452965,
            lng: 131.0161661,
        });
        map.setZoom(4);
        return;
    }
    const maps = mapsAPI.api;
    const bounds = new (maps.LatLngBounds as any)();

    const points = markers.map(marker => marker.point)

    const centerPoint = points[0]

    // Add two points to create a maximum possible level of zoom
    const maxZoom = 0.002; // about 0.5km

    bounds.extend(new (maps.LatLng as any)(
        centerPoint.lat + (maxZoom / 2),
        centerPoint.lon + (maxZoom / 2),
        undefined,
    ));
    bounds.extend(new (maps.LatLng as any)(
        centerPoint.lat - (maxZoom / 2),
        centerPoint.lon - (maxZoom / 2),
        undefined,
    ));

    // Loop though points and add to bounding box used for setting initial
    // map view. For each point add another point that's exactly opposite
    // when compared to the center point. This ensures that the center
    // point remains in the center.
    for (const point of points) {
        const latDiff = centerPoint.lat - point.lat;
        const lonDiff = centerPoint.lon - point.lon;

        bounds.extend(new (maps.LatLng as any)(point.lat, point.lon, undefined));
        bounds.extend(new (maps.LatLng as any)(
            centerPoint.lat + latDiff,
            centerPoint.lon + lonDiff,
            undefined,
        ));
    }

    map.fitBounds(bounds)

}
