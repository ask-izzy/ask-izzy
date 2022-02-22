/* @flow */
import Service from "./Service"
import {
    Timeout,
    TryWithDefault,
} from "../timeout";
import type {
    geoPoint,
} from "./general.js"
import Maps from "../maps";

const servicesWithTravelTimes: Service[] = []

/*
* Loads the transportTime property from google
* and adds it to the given Service instances
*/
export async function attachTransportTimes(
    services: Array<Service>
): Promise<void> {
    if (typeof window === "undefined") {
        // Google maps api doesn't work outside the browser.
    }

    let formatPoint = (point: geoPoint) => `${point.lat},${point.lon}`;

    const maps = await TryWithDefault < $ReadOnly < {travelTime: Function} >>(
        1000, Maps(), {}
    );

    if (typeof maps.travelTime === "function") {
        const servicesToLoadTravelTimesFor = services.filter(
            // skip services without publicly known locations
            service => !service.location?.isConfidential()
        ).filter(
            // skip services that already have travel times
            service => !service.travelTimes
        )

        const travelTimesForServices = await Timeout(
            1000 * 10, // wait for 10 secs before giving up
            maps.travelTime(servicesToLoadTravelTimesFor
                // $FlowIgnore isConfidential checks location.point
                .map(({location}) => formatPoint(location.point))
            )
        );

        for (const service of servicesToLoadTravelTimesFor) {
            service.travelTimes = travelTimesForServices.shift()
        }

        servicesWithTravelTimes.push(...servicesToLoadTravelTimesFor)
    }
}

export async function removeAllTransitTimes() {
    for (const service of servicesWithTravelTimes) {
        service.travelTimes = null
    }
}

