/*
 * Definitions for Geolocation related steps
 */

/* @flow */

"use strict";

import Yadda from 'yadda';
import assert from 'assert';
import { By } from 'selenium-webdriver';
import _ from 'underscore';

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given("I'm watching map events", unpromisify(instrumentMap))
        .then('I should see a map', unpromisify(assertMap))
        .then('I should see $NUM markers?', unpromisify(assertMarkers))
        .then('a marker should have position $LATITUDE $LONGITUDE',
              unpromisify(assertMarkerCoords))
        ;
})();

/**
 * instrumentMap:
 *
 * Instrument Google map so we can poke around in it in tests.
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

async function assertMap(): Promise<void> {
    var nMaps = await this.driver.executeScript(
        () => google.maps.maps.length
    );
    assert.equal(nMaps, 1);

    var visible = await this.driver
                    .findElement(By.css('.gm-style'))
                    .isDisplayed();

    assert.equal(visible, true);
}

async function assertMarkers(num: number): Promise<void> {
    var nMaps = await this.driver.executeScript(
        () => google.maps.markers.length
    );
    assert.equal(nMaps, num);
}

async function assertMarkerCoords(lat: number, lng: number): Promise<void> {
    var markers = await this.driver.executeScript(
        () => google.maps.markers
            .map(marker => {
                var position = marker.getPosition();

                return {
                    /* Be aware of floating point precision, we're
                     * comparing to a precision of 6 significant figures */
                    lat: position.lat().toPrecision(6),
                    lng: position.lng().toPrecision(6),
                };
            })
    );

    assert(_.findWhere(markers,
                       {
                           lat: lat.toPrecision(6),
                           lng: lng.toPrecision(6),
                       }));
}
