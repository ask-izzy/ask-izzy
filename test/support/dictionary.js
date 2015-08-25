/* @flow */

"use strict";

import assert from 'assert';
import Yadda from 'yadda';
import _ from 'underscore';

type callback = (err: ?Error, val: any) => void;

function latitudeConverter(latitude: string, done: callback): void {
    latitude = latitude
        .replace(/N$/, '')
        .replace(/(.+)S$/, '-$1');

    done(null, parseFloat(latitude));
}

function longitudeConverter(longitude: string, done: callback): void {
    longitude = longitude
        .replace(/E$/, '')
        .replace(/(.+)W$/, '-$1');

    done(null, parseFloat(longitude));
}

function linesConverter(str: string, done: callback): void {
    done(null, str.split("\n"));
}

function tableConverter(str: string, done: callback): void {
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
