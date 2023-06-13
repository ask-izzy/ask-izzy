import {$ReadOnly} from "utility-types";

import Service from "@/src/iss/Service.js"
import {
    Timeout,
    TryWithDefault,
} from "@/src/timeout.js";
import type {
    geoPoint,
} from "@/src/iss/general.js"
import Maps from "@/src/maps.js";


const servicesWithTravelTimes: Service[] = []

/*
* Loads the transportTime property from google
* and adds it to the given Service instances
*/
export async function attachTransportTimes(
    services: Array<Service>,
): Promise<void> {
    if (typeof window === "undefined") {
        // Google maps api doesn't work outside the browser.
    }

    const formatPoint = (point: geoPoint) => `${point.lat},${point.lon}`;

    const maps = await TryWithDefault<
        $ReadOnly<{travelTime:(...args: Array<any>) => any;}>
            >(1000, Maps(), {} as any)

    if (typeof maps.travelTime === "function") {
        const servicesToLoadTravelTimesFor = services.filter(
            // skip services without publicly known locations
            service => !service.location?.isConfidential(),
        ).filter(
            // skip services that already have travel times
            service => !service.travelTimes,
        )

        const travelTimesForServices: any = await Timeout(
            1000 * 10, // wait for 10 secs before giving up
            maps.travelTime(servicesToLoadTravelTimesFor
                .map(({location}) => formatPoint(location.point)),
            ),
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

