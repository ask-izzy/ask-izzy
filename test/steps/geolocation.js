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
        .given("control of geolocation", unpromisify(mockGeolocation))
        .given("I'm at (\\d+.\\d+[NS]) (\\d+.\\d+[EW])",
               unpromisify(setLocationFromCoords))
        .given('my location is "$STRING"', unpromisify(setLocation))
        .when('I deny access to geolocation',
              unpromisify(disableGeolocation));
})();

/**
 * mockGeolocation:
 *
 * Install geolocation mock.
 *
 * Returns: a promise that resolves when the mock is installed
 */
async function mockGeolocation(): Promise<void> {
    await this.driver.executeScript(() => {
        /* taken from mock-geolocation */
        function mockGeolocation_(object) {
            console.log("Mocking geolocation with", object);
            if (Object.defineProperty) {
                Object.defineProperty(navigator, 'geolocation', {
                    get: () => {
                        return object;
                    },
                });
            } else if (navigator.__defineGetter__) {
                navigator.__defineGetter__('geolocation', () => {
                    return object;
                });
            } else {
                throw new Error(
                    'Cannot change navigator.geolocation method'
                );
            }
        };

        /* install a mock that stores the success and error methods */
        mockGeolocation_({
            getCurrentPosition: (success, error, opt) => {
                window.mockGeolocationSuccess = success;
                window.mockGeolocationError = error;
            },
        });
    });
}

/**
 * setLocationFromCoords:
 *
 * Mock geolocation to set coordinates.
 *
 * Navigating to a new URL undoes the mock.
 */
async function setLocationFromCoords(latitude: string,
                                     longitude: string): Promise<void> {

    latitude = latitude
        .replace(/N$/, '')
        .replace(/(.+)S$/, '-$1');

    latitude = parseFloat(latitude);

    longitude = longitude
        .replace(/E$/, '')
        .replace(/(.+)W$/, '-$1');

    longitude = parseFloat(longitude);

    await this.driver.executeScript((obj) => {
        mockGeolocationSuccess(obj);
    },

    {
        coords: {
            latitude: latitude,
            longitude: longitude,
        },
    });
}

/**
 * setLocation:
 * Set the user's location in the browser's session
 */
async function setLocation(location: string): Promise<void> {
    await gotoUrl(this.driver, '/');  // go anywhere to start the session
    await this.driver.executeScript((location) => {
        sessionStorage.setItem("location", location);
    }, location);
}

async function disableGeolocation(): Promise {
    await this.driver.executeScript((obj) => {
        mockGeolocationError(obj);
    },

    {
        message: "User denied access",
    });
}
