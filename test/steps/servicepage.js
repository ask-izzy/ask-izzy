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
        ;
})();

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
