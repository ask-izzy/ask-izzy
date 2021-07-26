/* @flow */

/*
 * Definitions for Geolocation related steps
 */

/* eslint-disable no-use-before-define */

import Yadda from "yadda";
import type { LibraryEnglish as YaddaLibraryEnglish } from "yadda"

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";
import { gotoUrl } from "../support/webdriver";

declare var IzzyStorage: Object;

module.exports = ((function(): YaddaLibraryEnglish {
    return Yadda.localisation.English.library(dictionary)
        .given("control of geolocation", unpromisify(mockGeolocation))
        .given("I'm at $LATITUDE $LONGITUDE", unpromisify(sendCoords))
        .given("my location is \"$STRING\"", unpromisify(setLocation))
        .given("my location is $LATITUDE $LONGITUDE", unpromisify(setCoords))
        .when("I deny access to geolocation",
            unpromisify(disableGeolocation));
})(): YaddaLibraryEnglish);

/**
 * Install geolocation mock.
 *
 * @returns {Promise} a promise that resolves when the mock is installed.
 */
async function mockGeolocation(): Promise<void> {
    await this.driver.executeScript(() => {
        IzzyStorage.setGeolocationMock(true, {wait: true})
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
        IzzyStorage.setGeolocationMock(true, obj)
    }, {coords: {latitude, longitude}});
}

/**
 * Set the user's location in the browser's session.
 *
 * @param {string} location - user's location (e.g. Richmond)
 * @returns {Promise} promise that resolves when the value is set.
 */
async function setLocation(location: string): Promise<void> {
    if (!location.match(/, /)) {
        throw new Error(
            "Location must have suburb & state separated by ', '."
        )
    }

    await gotoUrl(this.driver, "/"); // go anywhere to start the session
    await this.driver.executeScript((location) => {
        IzzyStorage.setLocation(location);
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
    await this.driver.executeScript((coords) => {
        IzzyStorage.setCoordinates(coords);
    }, {latitude, longitude});
}

async function disableGeolocation(): Promise<void> {
    await this.driver.executeScript(() => {
        IzzyStorage.setGeolocationMock(
            false,
            {message: "User denied access"},
        )
    });
}
