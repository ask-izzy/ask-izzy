/* @flow */
/**
 * Geolocation functions.
 *
 * @module geolocation
 */

import location from "browser-location";

/**
 * Returns a promise to get the user's geolocation from the browser.
 *
 * @param {?PositionOptions} options - position options.
 *
 * @returns {Promise<Position>} the user's position.
 */
function locate(options: ?PositionOptions): Promise<Position> {
    return new Promise((resolve, reject) => {
        location.get(options || {}, (err, position) => {
            if (err) {
                reject(err);
            } else {
                resolve(position);
            }
        });
    });
}

export default locate;
