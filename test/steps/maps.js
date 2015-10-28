/* flow:disable */

/*
 * Definitions for Geolocation related steps
 */

/* eslint-disable no-use-before-define */

import Yadda from "yadda";
import assert from "assert";
import { By } from "selenium-webdriver";

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";

declare var google: Google;

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given("I'm watching map events", unpromisify(instrumentMap))
        .when("I click on the map", unpromisify(clickMap))
        .when('I click marker titled "$STRING"', unpromisify(clickMarker))
        .then("I should see a map", unpromisify(assertMap))
        .then("I should see markers?\n$table", unpromisify(assertMarkers))
        .then('I can get to google maps by clicking "$STRING"',
            unpromisify(assertGoogleMapsLink))
        .then("I can get to google maps by clicking the static google map",
            unpromisify(assertGoogleMapsLink))
        .then("I should see the static google map",
            unpromisify(seeTheStaticMap))
        .then("I should not see the static google map",
            unpromisify(cannotSeeTheStaticMap))
        ;
})();

/**
 * Instrument Google map so we can poke around in it in tests.
 *
 * @returns {Promise} promise that resolves when the script executes.
 */
async function instrumentMap(): Promise<void> {
    await this.driver.executeScript(() => {
        /* Instrument Map */
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
    });
}

async function clickMap(): Promise<void> {
    await this.driver.executeScript(() => {
        google.maps.event.trigger(google.maps.maps[0], "click");
    });
}

async function clickMarker(title: string): Promise<void> {
    await this.driver.executeScript(title => {
        for (let marker of google.maps.markers) {
            if (title == marker.getTitle()) {
                google.maps.event.trigger(marker, "click", {
                    latLng: marker.getPosition(),
                });
                break;
            }
        }
    }, title);
}

async function assertMap(): Promise<void> {
    let nMaps = await this.driver.executeScript(
        () => google.maps.maps.length
    );

    assert.equal(nMaps, 1);

    let visible = await this.driver
                    .findElement(By.css(".gm-style"))
                    .isDisplayed();

    assert.equal(visible, true);
}

async function seeTheStaticMap() {
    const map = await this.driver.findElement(By.css(".StaticMap"));
    const visible = await map.isDisplayed();

    assert(visible, `Map was present but not visible`);
}

async function cannotSeeTheStaticMap() {
    let map;

    try {
        map = await this.driver.findElement(By.css(".StaticMap"));
    } catch (error) {
        return;
    }
    const visible = await map.isDisplayed();

    assert(!visible, `Map was visible`);
}

async function assertGoogleMapsLink(text: ?string) {
    const selector = text ? By.partialLinkText(text) : By.css(".StaticMap");
    let link = await this.driver.findElement(selector);
    let visible = await link.isDisplayed();

    assert(visible, `Link was present but not visible`);

    let href = await link.getAttribute("href");
    let sel = /^https:\/\/maps.google.com\/.*/;

    assert(href.match(sel), "Expected a link to google maps");
}

async function assertMarkers(table: Array<Object>): Promise<void> {
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
