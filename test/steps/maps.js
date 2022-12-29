/*
 * Definitions for Geolocation related steps
 */

/* eslint-disable no-use-before-define */

import Yadda from "yadda";
import assert from "assert";
import { By } from "selenium-webdriver";

import dictionary from "../support/dictionary.js";

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given("I'm watching map events", instrumentMap)
        .given("googles directions matrix will return\n$yaml",
            instrumentDistanceMatrix
        )
        .when("I click on the map", clickMap)
        .when("I click marker titled \"$STRING\"", clickMarker)
        .then("I should see a map", assertMap)
        .then("I should see markers?\n$table", assertMarkers)
        .then("I can see travel times", assertTravelTimes)
        .then("I should be able to travel there \"$STRING\"",
            assertTransitMethod
        )
        .then("I should not be able to travel there \"$STRING\"",
            assertTransitMethodNot
        )
})();

async function assertTravelTimes() {
    const travelTimes = ["walking", "transit", "driving"]

    for (let index = 0; index < travelTimes.length; index++) {
        try {
            travelTimes[index] = await this.driver.findElement(
                By.css(".travel-time.travel-mode-" + travelTimes[index])
            )
            travelTimes[index] = await travelTimes[index]
                .findElement(By.tagName("time"))
                .getAttribute("datetime")

            // Get current date from loaded page since date might be mocked
            const currentDate = new Date(
                await this.driver.executeScript("return (new Date()).getTime()")
            )

            // Arrival time is a future date
            travelTimes[index] = (
                new Date(travelTimes[index]) - currentDate
            ) > 0
        } catch (err) {
            console.error("Error when checking travel times")
            console.error(err)
            travelTimes[index] = false
        }
    }

    assert.ok(travelTimes.every(time => time))
}

async function assertTransitMethod(method) {
    await assert.withRetries(assert.svgIsVisible)(this.driver, method);
}

async function assertTransitMethodNot(method) {

    let exists = await this.driver.findElements(By.css(
        `[aria-label='${method}'] svg`
    )).length > 0;

    assert.equal(exists, false);
}

/**
 * Stub google directions so we can get reliable results
 *
 * @param {results} results for autocomplete requests
 *
 * @returns {Promise} promise that resolves when the script executes.
 */
async function instrumentDistanceMatrix(results) {
    await this.driver.executeScriptBeforeLoad(createMocks, results);

    const url = await this.driver.getCurrentUrl()
    if (url.includes("localhost")) {
        await this.driver.executeScript(createMocks, results);
    }

    function createMocks(results) {
        console.log("Registering google maps api distance matrix mock")
        window.googleMocks = window.googleMocks || []
        window.googleMocks.push({
            maps: {
                DistanceMatrixService: function() {
                    return {
                        getDistanceMatrix: function(params, callback) {
                            const clonedResults = JSON.parse(
                                JSON.stringify(results)
                            )
                            return callback(
                                {
                                    rows: [
                                        {
                                            elements: clonedResults,
                                        },
                                    ],
                                },
                                google.maps.DirectionsStatus.OK,
                            );
                        },
                    };
                },
            },
        });
    }
}

/**
 * Instrument Google map so we can poke around in it in tests.
 *
 * @returns {Promise} promise that resolves when the script executes.
 */
async function instrumentMap() {
    // Wait until the map appears
    await this.driver.wait(() =>
        this.driver.executeScript(() => {
            /* Instrument Map */
            if (!window.google) {
                return false
            }
            let RealMap = google.maps.Map;

            google.maps.Map = function() {
                let map = RealMap.apply(this, arguments);

                this.recordMap();
                return map;
            };

            google.maps.maps = [];
            google.maps.Map.prototype = RealMap.prototype;
            google.maps.Map.prototype.recordMap = function() {
                google.maps.maps.push(this);
            };

            /* Instrument Marker */
            let RealMarker = google.maps.Marker;

            google.maps.markers = [];
            google.maps.Marker = function() {
                let marker = RealMarker.apply(this, arguments);

                this.recordMarker();
                return marker;
            };

            google.maps.Marker.prototype = RealMarker.prototype;
            google.maps.Marker.prototype.recordMarker = function() {
                google.maps.markers.push(this);
            };
            return true;
        }), 10000
    );

}

async function clickMap() {
    await this.driver.executeScript(() => {
        google.maps.event.trigger(google.maps.maps[0], "click");
    });
}

async function clickMarker(title) {
    const errorMsg = await this.driver.executeScript(title => {
        for (let index = 0; index < google.maps.markers.length; index++) {
            let marker = google.maps.markers[index]
            if (title === marker.getTitle()) {
                google.maps.event.trigger(marker, "click", {
                    latLng: marker.getPosition(),
                });
                return;
            }
        }
        const titles = JSON.stringify(
            google.maps.markers.map(marker => marker.getTitle())
        )
        return `Could not find marker with title "${title}" out of ${titles}`
    }, title);

    if (errorMsg) {
        throw new Error(errorMsg)
    }
}

async function assertMap() {
    // Wait until the map appears
    await this.driver.wait(() =>
        this.driver.executeScript(
            () => google.maps.maps.length
        ),
    10000,
    );
    let visible = await this.driver
        .findElement(By.css(".gm-style"))
        .isDisplayed();

    assert.equal(visible, true);
}

async function assertMarkers(table) {
    let markers = await this.driver.executeScript(
        () => google.maps.markers.map(marker => {
            let position = marker.getPosition();

            return {
                Title: marker.getTitle(),
                /* Be aware of floating point precision, we're
                 * comparing to a precision of 6 significant figures */
                Latitude: position.lat().toPrecision(6),
                Longitude: position.lng().toPrecision(6),
            };
        })
    );

    /* Sort tables by title for comparison */
    function cmp(first, second) {
        return first.Title.localeCompare(second.Title);
    }

    assert.deepEqual(markers.sort(cmp),
        table.sort(cmp));
}
