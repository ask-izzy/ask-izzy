/* @flow */
/**
 * Geolocation functions.
 *
 * @module geolocation
 */

import location from "browser-location";
import storage from "./storage";

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
        typeof navigator.geolocation.getCurrentPosition === 'function';
}
