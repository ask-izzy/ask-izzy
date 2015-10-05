/* @flow */
/* eslint-disable no-use-before-define */

import assert from "assert";
import Yadda from "yadda";
import _ from "underscore";
import { By } from "selenium-webdriver";

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";

module.exports = (function() {

    return Yadda.localisation.English.library(dictionary)
        .then("I should see the contacts\n$lines",
              unpromisify(checkPhoneNumbers))
        .then("I should see a transport time of \"$string\"",
              unpromisify(checkTransportTime))
        .then("I should see a transport time of\n$lines",
              unpromisify(checkTransportTimeLines))
        ;
})();

async function checkTransportTimeLines(time: Array<string>): Promise<void> {
    await checkTransportTime.apply(this, [time.join("\n")]);
}

async function checkTransportTime(time: string): Promise<void> {
    var allTransports = await this.driver.findElements(
        By.css(".TransportTime")
    );
    var visibleTransports = await asyncFilter(
        allTransports,
        elem => elem.isDisplayed()
    );
    var text = await Promise.all(visibleTransports.map(
        elem => elem.getText()
    ));

    if (text.indexOf(time) === -1) {
        assert(false, `Expected '${text.join("\n")}' to include '${time}'`);
    }
}

async function asyncFilter(arr, check) {
    var results = arr.map(check);

    results = await Promise.all(results);

    return _.zip(results, arr)
        .filter(elem => elem[0])
        .map(elem => elem[1]);
}

async function checkPhoneNumbers(lines: Array<string>): Promise<void> {
    var phoneElems = await this.driver.findElements(By.css(".Contact"));
    var visiblePhoneElems = await asyncFilter(
        phoneElems,
        elem => elem.isDisplayed()
    );
    var text = await Promise.all(visiblePhoneElems.map(
        elem => elem.getText()
    ));

    assert.deepEqual(text, lines);
}
