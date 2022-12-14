import Yadda from "yadda";
import _ from "underscore";
import getServiceFixture from "../../fixtures/factories/Service";
import yaml from "js-yaml";


function latitudeConverter(latitude, done) {
    latitude = latitude
        .replace(/N$/, "")
        .replace(/(.+)S$/, "-$1");

    done(null, parseFloat(latitude));
}

function longitudeConverter(longitude, done) {
    longitude = longitude
        .replace(/E$/, "")
        .replace(/(.+)W$/, "-$1");

    done(null, parseFloat(longitude));
}

function linesConverter(str, done) {
    done(null, str.split("\n"));
}

// Converts a key from the format used in features to an object key
function sanitizeKey(key) {
    return key
        .toLowerCase()
        .replace(" ", "_")
        .replace("/", "_");
}

function parseObject(lines) {
    /* Objects have format
     * Key | Value
     * Key | Value
     * Key | Value
     */
    let downcaseKey = arr => [sanitizeKey(arr[0]), arr[1]];

    return _.object(
        lines.map(
            line => downcaseKey(line.split("|").map(cell => cell.trim()))
        )
    );
}

function parseTable(lines) {
    /* Tables have format
     * Header | Header | Header
     * ========================
     * Cell   | Cell   | Cell
     *
     * If the line of '============='
     * is absent, we have an object
     * rather than a table.
     */

    if (!lines[1] || !lines[1].trim().match(/^=+$/)) {
        return parseObject(lines);
    }

    let header = lines
        .shift()
        .split("|")
        .map(cell => cell.trim());

    lines.shift();
    return lines.map(
        line => _.object(
            header,
            line.split("|")
                .map(cell => cell.trim())
        )
    );
}

function tableConverter(str, done) {
    let lines = str.split("\n");

    done(null, parseTable(lines));
}

/*
 * Parses a service description out of a yadda step
 */
function serviceConverter(str, done) {
    try {
        done(null, getServiceFixture(yaml.safeLoad(str)));
    } catch (error) {
        done(error)
    }
}

/*
 * Parses a service description out of a yadda step
 */
function servicesConverter(str, done) {
    try {
        done(null, yaml.safeLoad(str).map(getServiceFixture));
    } catch (error) {
        done(error)
    }
}
/*
 * Parses arbitrary yaml out of a yadda step
 */
function yamlConverter(str, done) {
    try {
        done(null, yaml.safeLoad(str));
    } catch (error) {
        done(error)
    }
}

/*
 * Parses a number out of a yadda step
 */
function numberConverter(str, done) {
    try {
        done(null, parseInt(str));
    } catch (error) {
        done(error)
    }
}

/* eslint-disable no-control-regex, newline-after-var */
const dictionary = new Yadda.Dictionary()
    .define("LATITUDE", /(\d+.\d+[NS])/, latitudeConverter)
    .define("LONGITUDE", /(\d+.\d+[EW])/, longitudeConverter)
    .define("lines", /([^\u0000]*)/, linesConverter)
    .define("table", /([^\u0000]*)/, tableConverter)
    .define("service", /([^\u0000]*)/, serviceConverter)
    .define("services", /([^\u0000]*)/, servicesConverter)
    .define("yaml", /([^\u0000]*)/, yamlConverter)
    .define("NUMBER", /([^\u0000]*)/, numberConverter);
/* eslint-enable */

export default dictionary;
