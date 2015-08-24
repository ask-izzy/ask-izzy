/* @flow */

"use strict";

import assert from 'assert';
import Yadda from 'yadda';
import _ from 'underscore';

function latitudeConverter(latitude: string, done: Function): void {
    latitude = latitude
        .replace(/N$/, '')
        .replace(/(.+)S$/, '-$1');

    done(null, parseFloat(latitude));
}

function longitudeConverter(longitude: string, done: Function): void {
    longitude = longitude
        .replace(/E$/, '')
        .replace(/(.+)W$/, '-$1');

    done(null, parseFloat(longitude));
}

function linesConverter(str: string, done: Function): void {
    done(null, str.split("\n"));
}

function tableConverter(str: string, done: Function): void {
    /* Tables have format
     * Header | Header | Header
     * ========================
     * Cell   | Cell   | Cell
     */
    var lines = str.split('\n');
    var header = lines
        .shift()
        .split('|')
        .map(cell => cell.trim());

    lines.shift();

    done(null, lines.map(
         line => _.object(header,
                          line
                             .split('|')
                             .map(cell => cell.trim())
                         )
    ));
}

var dictionary = new Yadda.Dictionary()
    .define('LATITUDE', /(\d+.\d+[NS])/, latitudeConverter)
    .define('LONGITUDE', /(\d+.\d+[EW])/, longitudeConverter)
    .define('lines', /([^\u0000]*)/, linesConverter)
    .define('table', /([^\u0000]*)/, tableConverter);

export default dictionary;
