/*
 * Step definitions for geolocation related steps
 */

import Yadda from "yadda"

import dictionary from "../support/dictionary"
import { gotoUrl, runOnPageLoad } from "../support/world"
import type { StepContext } from "../support/world"

export default Yadda.localisation.English.library(dictionary)
    .given("GPS will hang in the loading state", async function(this: StepContext) {
        await this.world.page.evaluate(() => {
            window.IzzyStorage.setGeolocationMock(true, {wait: true})
        })
    })
    .given("the GPS returns $LATITUDE $LONGITUDE", sendCoords)
    .given("the area to search is \"$STRING\"", setLocation)
    .given("my location is $LATITUDE $LONGITUDE in \"$STRING\"", setCoords)
    .when("I deny access to geolocation", async function(this: StepContext) {
        await this.world.page.evaluate(() => {
            window.IzzyStorage.setGeolocationMock(
                false,
                {message: "User denied access"},
            )
        })
    })
    .given("google api geocode will return location name $SUBURB, $STATE",
        mockGoogleApiGeocodeLocationName
    )

/*
 * Mock geolocation to return the given coordinates.
 *
 * Navigating to a new URL undoes the mock.
 */
async function sendCoords(
    this: StepContext,
    latitude: number,
    longitude: number,
): Promise<void> {
    await this.world.page.evaluate(obj => {
        window.IzzyStorage.setGeolocationMock(true, obj)
    }, {coords: {latitude, longitude}})
}

/*
 * Set the user's location in the browser's session.
 */
async function setLocation(this: StepContext, location: string): Promise<void> {
    if (!location.match(/, /)) {
        throw new Error(
            "Location must have suburb & state separated by ', '."
        )
    }

    await gotoUrl(this.world.page, "/404") // go anywhere to start the session
    await this.world.page.evaluate(location => {
        window.IzzyStorage.setSearchArea(location)
    }, location)
}

/*
 * Set the user's coordinates in the browser's session.
 */
async function setCoords(
    this: StepContext,
    latitude: number,
    longitude: number,
    locationName: string
): Promise<void> {
    await this.world.page.evaluate(location => {
        window.IzzyStorage.setUserGeolocation(location)
    }, {name: locationName, latitude, longitude})
}

/*
 * Stub google geocode so we can get reliable results
 */
async function mockGoogleApiGeocodeLocationName(
    this: StepContext,
    mockedSuburb: string,
    mockedState: string
): Promise<void> {
    await runOnPageLoad(this.world.page, ({mockedSuburb, mockedState}) => {
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
                                window.google.maps.GeocoderStatus.OK,
                            )
                        },
                    }
                },
            },
        })
    }, {mockedSuburb, mockedState}, true)
}
