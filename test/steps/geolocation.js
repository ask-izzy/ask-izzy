/*
 * Definitions for Geolocation related steps
 */

/* @flow */
/* eslint-disable no-use-before-define */

import Yadda from "yadda";

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";
import { gotoUrl } from "../support/webdriver";

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given("control of geolocation", unpromisify(mockGeolocation))
        .given("I'm at $LATITUDE $LONGITUDE", unpromisify(sendCoords))
        .given('my location is "$STRING"', unpromisify(setLocation))
        .given("my location is $LATITUDE $LONGITUDE", unpromisify(setCoords))
        .when("I deny access to geolocation",
              unpromisify(disableGeolocation));
})();

/**
 * Install geolocation mock.
 *
 * @returns {Promise} a promise that resolves when the mock is installed.
 */
async function mockGeolocation(): Promise<void> {
    await this.driver.executeScript(() => {
        /* taken from mock-geolocation */
        function mockGeolocation_(object) {
            console.log("Mocking geolocation with", object);
            if (Object.defineProperty) {
                Object.defineProperty(navigator, "geolocation", {
                    get: () => {
                        return object;
                    },
                });
            } else if (navigator.__defineGetter__) {
                navigator.__defineGetter__("geolocation", () => {
                    return object;
                });
            } else {
                throw new Error(
                    "Cannot change navigator.geolocation method"
                );
            }
        }

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
 * Mock geolocation to set coordinates.
 *
 * Navigating to a new URL undoes the mock.
 *
 * @param {number} latitude - latitude.
 * @param {number} longitude - longitude.
 * @returns {Promise} promise that resolves when the mock is installed.
 */
async function sendCoords(
    latitude: number,
    longitude: number,
): Promise<void> {
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
 * Set the user's location in the browser's session.
 *
 * @param {string} location - user's location (e.g. Richmond)
 * @returns {Promise} promise that resolves when the value is set.
 */
async function setLocation(location: string): Promise<void> {
    await gotoUrl(this.driver, "/");  // go anywhere to start the session
    await this.driver.executeScript((location) => {
        sessionStorage.setItem("location", location);
    }, location);
}

/**
 * Set the user's coordinates in the browser's session.
 *
 * @param {number} latitude - latitude.
 * @param {number} longitude - longitude.
 * @returns {Promise} promise that resolves when the value is set.
 */
async function setCoords(latitude: number, longitude: number): Promise<void> {
    await gotoUrl(this.driver, "/");  // go anywhere to start the session
    await this.driver.executeScript((coords) => {
        sessionStorage.setItem("coordinates", JSON.stringify(coords));
    },

        {
            latitude: latitude,
            longitude: longitude,
        });
}

async function disableGeolocation(): Promise {
    await this.driver.executeScript((obj) => {
        mockGeolocationError(obj);
    },

        {
            message: "User denied access",
        });
}
