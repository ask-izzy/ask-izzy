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
        .given('I deny access to geolocation',
               unpromisify(disableGeolocation))
        .given('my location is "$STRING"', unpromisify(setLocation));
})();

/**
 * mockGeolocation:
 *
 * Install geolocation mock.
 *
 * Returns: a promise that resolves when the mock is installed
 */
function mockGeolocation(driver: Webdriver.WebDriver): Promise {
    return driver.executeScript(() => {
        /* taken from mock-geolocation */
        window.changeGeolocation = (object) => {
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
                                     longitude: string): Promise {

    latitude = latitude
        .replace(/N$/, '')
        .replace(/(.+)S$/, '-$1');

    latitude = parseFloat(latitude);

    longitude = longitude
        .replace(/E$/, '')
        .replace(/(.+)W$/, '-$1');

    longitude = parseFloat(longitude);

    await mockGeolocation(this.driver);
    await this.driver.executeScript((obj) => {
        changeGeolocation({
            getCurrentPosition: (success, error, opt) => {
                /* simulate aquiring GPS lock */
                setTimeout(() => success(obj), 1500);
            },
        });
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
async function setLocation(location: string): Promise {
    await gotoUrl(this.driver, '/');  // go anywhere to start the session
    await this.driver.executeScript((location) => {
        sessionStorage.setItem("location", location);
    }, location);
}

async function disableGeolocation(): Promise {
    await mockGeolocation(this.driver);
    await this.driver.executeScript((obj) => {
        changeGeolocation({
            getCurrentPosition: function(success, error, opt) {
                /* simulate aquiring GPS lock */
                setTimeout(() => error(obj), 1500);
            },
        });

    },

    {
        message: "User denied access",
    });
}
