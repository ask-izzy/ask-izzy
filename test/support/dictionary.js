"use strict";

import assert from 'assert';
import Yadda from 'yadda';
import _ from 'underscore';

function linesConverter(str, cb) {
    cb(null, str.split("\n"));
}

function tableConverter(str, cb) {
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

    cb(null, lines.map(
        line => _.object(header,
                         line
                            .split('|')
                            .map(cell => cell.trim())
                        )
    ));
}

var dictionary = new Yadda.Dictionary()
    .define('lines', /([^\u0000]*)/, linesConverter)
    .define('table', /([^\u0000]*)/, tableConverter);

export default dictionary;
