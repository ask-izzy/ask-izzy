/* @flow */

"use strict";

import assert from "assert";
import Yadda from 'yadda';
import _ from 'underscore';
import { By } from 'selenium-webdriver';

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";

async function asyncFilter(arr, check) {
    var results = arr.map(check);
    results = await Promise.all(results);
    return _.zip(results, arr)
        .filter((e) => e[0])
        .map((e) => e[1]);
}

module.exports = (function() {

    async function checkPhoneNumbers(lines: Array<string>): Promise<void> {
        var phoneElems = await this.driver.findElements(By.css('a.Phone'));
        var visiblePhoneElems = await asyncFilter(
            phoneElems,
            (e) => e.isDisplayed()
        );

        var text = visiblePhoneElems.map((e) => e.getText());
        for (var i = 0; i < text.length; i++) {
            text[i] = await text[i];
        }

        assert.deepEqual(text, lines);
    }

    return Yadda.localisation.English.library(dictionary)
        .then('I should see the phone numbers\n$lines',
              unpromisify(checkPhoneNumbers));
})();
