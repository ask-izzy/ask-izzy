/*
 * Definitions for Geolocation related steps
 */

/* eslint-disable no-use-before-define */

import Yadda from "yadda";

import dictionary from "../support/dictionary.js";
import { gotoUrl } from "../support/webdriver.js";



module.exports = ((function() {
    return Yadda.localisation.English.library(dictionary)
        .given("GPS will hang in the loading state", mockGeolocation)
        .given("the GPS returns $LATITUDE $LONGITUDE", sendCoords)
        .given("the area to search is \"$STRING\"", setLocation)
        .given("my location is $LATITUDE $LONGITUDE in \"$STRING\"", setCoords)
        .when("I deny access to geolocation", disableGeolocation)
        .given("google api geocode will return location name $SUBURB, $STATE",
            mockGoogleApiGeocodeLocationName
        )
})());

/**
 * Install geolocation mock.
 *
 * @returns {Promise} a promise that resolves when the mock is installed.
 */
async function mockGeolocation() {
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
    latitude,
    longitude,
) {
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
async function setLocation(location) {
    if (!location.match(/, /)) {
        throw new Error(
            "Location must have suburb & state separated by ', '."
        )
    }

    await gotoUrl(this.driver, "/"); // go anywhere to start the session
    await this.driver.executeScript((location) => {
        IzzyStorage.setSearchArea(location);
    }, location);
}

/**
 * Set the user's coordinates in the browser's session.
 *
 * @param {number} latitude - latitude.
 * @param {number} longitude - longitude.
 * @param {string} locationName $Suburb, $State
 * @returns {Promise} promise that resolves when the value is set.
 */
async function setCoords(
    latitude,
    longitude,
    locationName
) {
    const location = {
        name: locationName,
        latitude,
        longitude,
    }
    await this.driver.executeScript((location) => {
        IzzyStorage.setUserGeolocation(location);
    }, location);
}

async function disableGeolocation() {
    await this.driver.executeScript(() => {
        IzzyStorage.setGeolocationMock(
            false,
            {message: "User denied access"},
        )
    });
}

/**
 * Stub google geocode so we can get reliable results
 *
 * @param {mockedSuburb} mockedSuburb the suburb to include in results
 * @param {mockedState} mockedState the state to include in results
 *
 * @returns {Promise} promise that resolves when the script executes.
 */
async function mockGoogleApiGeocodeLocationName(mockedSuburb, mockedState) {
    await this.driver.executeScriptBeforeLoad(createMocks, mockedSuburb, mockedState);

    const url = await this.driver.getCurrentUrl()
    if (url.includes("localhost")) {
        await this.driver.executeScript(createMocks, mockedSuburb, mockedState);
    }

    function createMocks(mockedSuburb, mockedState) {
        console.log("Registering google maps api geocoder mock")
        window.googleMocks = window.googleMocks || []
        window.googleMocks.push({
            maps: {
                Geocoder: function() {
                    return {
                        geocode: function(params, callback) {
                            return callback(
                                [{
                                    types: ["locality"],
                                    address_components: [
                                        {
                                            "long_name": mockedSuburb,
                                            "types": ["locality"],
                                        },
                                        {
                                            "short_name": mockedState,
                                            "types": [
                                                "administrative_area_level_1",
                                            ],
                                        },
                                    ],
                                }],
                                google.maps.GeocoderStatus.OK,
                            );
                        },
                    };
                },
            },
        });
    }
}
