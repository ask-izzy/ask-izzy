/* @flow */
/**
 * Geolocation functions.
 *
 * @module geolocation
 */

import location from "browser-location";
import storage from "./storage";
import _ from "underscore";
import Maps from "./maps";

/**
 * Returns a promise to get the user's geolocation from the browser.
 *
 * @param {?PositionOptions} options - position options.
 *
 * @returns {Promise<Position>} the user's position.
 */
export default function locate(options: ?PositionOptions): Promise<Position> {
    return new Promise((resolve, reject) => {
        const mock = storage.getGeolocationMock();

        if (mock && (typeof mock === "object") && "success" in mock) {
            const interval = setInterval(() => {
                const mock = storage.getGeolocationMock();

                if (mock.wait) {
                    return;
                }
                clearInterval(interval);

                if (mock.success) {
                    resolve(mock.result);
                } else {
                    reject(mock.result);
                }
            }, 200);

        } else {
            location.get(options || {}, (err, position) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(position);
                }
            });
        }
    });
}

export function geolocationAvailable(): boolean {
    const mock = storage.getGeolocationMock();

    if (mock && (typeof mock === "object") && "success" in mock) {
        // Allow overriding
        return true;
    }

    if (typeof navigator === "undefined") {
        return false;
    }

    return navigator.geolocation &&
        typeof navigator.geolocation.getCurrentPosition === "function";
}

export async function guessSuburb(location: Position): Promise<string> {
    const maps = await Maps();
    let possibleLocations = await maps.geocode({
        location: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
        },
    });

    /* return true if the types includes one of our interesting
     * component types */
    function interestingComponent(types: Array<string>): boolean {
        return !_.isEmpty(_.intersection(
            types,
            ["locality", "administrative_area_level_1"]
        ));
    }

    for (let geocodedLocation of possibleLocations) {
        if (_.contains(geocodedLocation.types, "locality")) {
            /* build a location name from the address components specified
             * in interestingComponent. We do this because we don't want
             * to show all the parts of Google's formatted_address */
            let name = geocodedLocation.address_components
                .filter(({types}) => interestingComponent(types))
                .map((component) => component.long_name)
                .join(", ");

            return name;
        }
    }

    throw "Unable to determine your suburb";
}
