/* @flow */

"use strict";

import location from 'browser-location';

/**
 * locate:
 *
 * Returns a promise to get the users geolocation from the browser.
 */
function locate(options: ?PositionOptions):
    Promise<Position | PositionError>
{
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
