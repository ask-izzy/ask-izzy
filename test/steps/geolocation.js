/*
 * Definitions for Geolocation related steps
 */

/* @flow */

"use strict";

import Yadda from 'yadda';

import unpromisify from "../support/yadda-promise";
import { gotoUrl } from '../support/webdriver';

module.exports = (function() {
    return Yadda.localisation.English.library()
        .given("I'm at (\\d+.\\d+[NS]) (\\d+.\\d+[EW])",
               unpromisify(setLocationFromCoords))
        .given('my location is "$STRING"', unpromisify(setLocation));
})();

/**
 * setLocationFromCoords:
 *
 * Mock geolocation to set coordinates.
 *
 * Navigating to a new URL undoes the mock.
 */
async function setLocationFromCoords(latitude: string,
                                     longitude: string): Promise {

    latitude = latitude
        .replace(/N$/, '')
        .replace(/(.+)S$/, '-$1');

    latitude = parseFloat(latitude);

    longitude = longitude
        .replace(/E$/, '')
        .replace(/(.+)W$/, '-$1');

    longitude = parseFloat(longitude);

    /* mock geonavigation */
    await this.driver.executeScript(`
    /* taken from mock-geolocation */
    var changeGeolocation = function(object) {
        console.log("Mocking geolocation with", object);
        if (Object.defineProperty) {
            Object.defineProperty(navigator, 'geolocation', {
                get: function() {
                    return object;
                }
            });
        } else if (navigator.__defineGetter__) {
            navigator.__defineGetter__('geolocation', function() {
                return object;
            });
        } else {
            throw new Error('Cannot change navigator.geolocation method');
        }
    };

    changeGeolocation({
        getCurrentPosition: function(success, error, opt) {
            /* simulate aquiring GPS lock */
            setTimeout(function () {
                success({
                    coords: {
                        latitude: ${latitude},
                        longitude: ${longitude}
                    }
                });
            }, 1000);
        }
    });
    `);
}

/**
 * setLocation:
 * Set the user's location in the browser's session
 */
async function setLocation(location: string): Promise {
    await gotoUrl(this.driver, '/');  // go anywhere to start the session
    await this.driver.executeScript(`
    sessionStorage.setItem("location", "${location}");
    `);
}
