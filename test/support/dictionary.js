/* @flow */

import Yadda from "yadda";
import _ from "underscore";
import Service from "../../fixtures/factories/Service";

type callback = (err: ?Error, val: any) => void;

function latitudeConverter(latitude: string, done: callback): void {
    latitude = latitude
        .replace(/N$/, "")
        .replace(/(.+)S$/, "-$1");

    done(null, parseFloat(latitude));
}

function longitudeConverter(longitude: string, done: callback): void {
    longitude = longitude
        .replace(/E$/, "")
        .replace(/(.+)W$/, "-$1");

    done(null, parseFloat(longitude));
}

function linesConverter(str: string, done: callback): void {
    done(null, str.split("\n"));
}

// Converts a key from the format used in features to an object key
function sanitizeKey(key: string): string {
    return key
        .toLowerCase()
        .replace(" ", "_")
        .replace("/", "_");
}

function parseObject(lines: Array<string>): Object {
    /* Objects have format
     * Key | Value
     * Key | Value
     * Key | Value
     */
    var downcaseKey = arr => [sanitizeKey(arr[0]), arr[1]];

    return _.object(
        lines.map(
            line => line.split("|").map(
                cell => cell.trim()
            )
        ).map(downcaseKey)
    );
}

function parseTable(lines: Array<string>): Array<Object> {
    /* Tables have format
     * Header | Header | Header
     * ========================
     * Cell   | Cell   | Cell
     */
    var header = lines
        .shift()
        .split("|")
        .map(cell => cell.trim());

    lines.shift();
    return lines.map(
         line => _.object(header,
                          line
                             .split("|")
                             .map(cell => cell.trim())
                         )
    );
}

function tableConverter(str: string, done: callback): void {
    var lines = str.split("\n");

    done(null, parseTable(lines));
}

/*
 * Parses a service description out of a yadda step
 */
function serviceConverter(str: string, done: callback): void {
    /* Services have format
     * * ArrayFieldName (eg `Phones`)
     *     Header | Header | Header
     *     ========================
     *     Cell   | Cell   | Cell
     * * FieldName (eg `Web`): <value>
     */
    var lines = str.split("\n");

    var serviceProps = {};
    var currentTableLines, // eg "Emails"
        currentTable,      // the lines which constitute a table
        parseFn,// how should currentTableLines be parsed
        line;              // The line we're currently parsing

    var lineIsValueRegexp = /^\s*\* ([^:]+): (.*)$/;
    var lineIsTableHeaderRegexp = /^\s*\* ([^\s:]+)$/;
    var lineIsObjectHeaderRegexp = /^\s*\* ([^\s:]+){}$/;

    function sanitizeValue(value: string): string {
        if (value == "(nada)") {
            return "";
        }
        return value;
    }

    function startBlock(newParser: Function, newTableKey: ?string): void {
        if (newTableKey) {
            newTableKey = sanitizeKey(newTableKey);
        }

        currentTable = newTableKey;
        parseFn = newParser;
        currentTableLines = [];
    }

    function endBlock(): void {
        if (currentTable && currentTableLines && parseFn) {
            serviceProps[currentTable] = parseFn(currentTableLines);
        }

        currentTable = undefined;
        parseFn = undefined;
        currentTableLines = undefined;
    }

    for (line of lines) {
        var isValue = line.match(lineIsValueRegexp);
        var isTableHeader = line.match(lineIsTableHeaderRegexp);
        var isObjectHeader = line.match(lineIsObjectHeaderRegexp);

        if (isValue) {
            serviceProps[sanitizeKey(isValue[1])] = sanitizeValue(isValue[2]);
        } else if (isObjectHeader) {
            endBlock();
            startBlock(parseObject, isObjectHeader[1].toLowerCase());
        } else if (isTableHeader) {
            endBlock();
            startBlock(parseTable, isTableHeader[1]);
        } else if (currentTableLines) {
            currentTableLines.push(line); // Add table row
        } else {
            done(new Error(`Could not understand table line: "${line}"`));
            return;
        }
    }
    endBlock();

    done(null, Service(serviceProps));
}

var dictionary = new Yadda.Dictionary()
    .define("LATITUDE", /(\d+.\d+[NS])/, latitudeConverter)
    .define("LONGITUDE", /(\d+.\d+[EW])/, longitudeConverter)
    .define("lines", /([^\u0000]*)/, linesConverter)
    .define("table", /([^\u0000]*)/, tableConverter)
    .define("service", /([^\u0000]*)/, serviceConverter)
    ;

export default dictionary;
