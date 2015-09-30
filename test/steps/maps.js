/* @flow */
/*
 * Definitions for Geolocation related steps
 */

/* eslint-disable no-use-before-define */

import Yadda from "yadda";
import assert from "assert";
import { By } from "selenium-webdriver";

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given("I'm watching map events", unpromisify(instrumentMap))
        .when("I click on the map", unpromisify(clickMap))
        .when('I click marker titled "$STRING"', unpromisify(clickMarker))
        .then("I should see a map", unpromisify(assertMap))
        .then("I should see markers?\n$table", unpromisify(assertMarkers))
        .then('I can get to google maps by clicking "$STRING"',
            unpromisify(assertGoogleMapsLink)
        )
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
        var RealMap = google.maps.Map;

        google.maps.Map = function() {
            var map = RealMap.apply(this, arguments);

            this.recordMap();
            return map;
        };

        google.maps.maps = [];
        google.maps.Map.prototype = RealMap.prototype;
        google.maps.Map.prototype.recordMap = function() {
            google.maps.maps.push(this);
        };

        /* Instrument Marker */
        var RealMarker = google.maps.Marker;

        google.maps.markers = [];
        google.maps.Marker = function() {
            var marker = RealMarker.apply(this, arguments);

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
        for (var marker of google.maps.markers) {
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
    var nMaps = await this.driver.executeScript(
        () => google.maps.maps.length
    );

    assert.equal(nMaps, 1);

    var visible = await this.driver
                    .findElement(By.css(".gm-style"))
                    .isDisplayed();

    assert.equal(visible, true);
}

async function assertGoogleMapsLink(linkText: string) {
    var link = await this.driver.findElement(By.partialLinkText(linkText));
    var visible = await link.isDisplayed();

    assert(visible, `Link '${linkText}' was present but not visible`);

    var href = await link.getAttribute("href");
    var sel = /^https:\/\/maps.google.com\/.*/;

    assert(href.match(sel), "Expected a link to google maps");
}

async function assertMarkers(table: Array<Object>): Promise<void> {
    var markers = await this.driver.executeScript(
        () => google.maps.markers.map(marker => {
            var position = marker.getPosition();

            return {
                Title: marker.getTitle(),
                Label: marker.getLabel(),
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
