/* @flow */

"use strict";

declare class GoogleMaps {
}

declare class Google {
    maps: GoogleMaps;
}

declare var google: Google;

class MapsApi {
    api: maps;

    constructor(api: Object) {
        this.api = api;
    }
}

/**
 * Maps:
 * Returns a promise that will resolve to the Google Maps API
 */
function maps(): Promise<MapsApi> {
    return new Promise((resolve, reject) => {
        function checkLoaded() {
            try {
                google.maps;
                resolve(new MapsApi(google.maps));
            } catch (e) {
                /* try again in 500ms */
                setTimeout(checkLoaded, 500);
            }
        }

        checkLoaded();
    });
}

export default maps;
