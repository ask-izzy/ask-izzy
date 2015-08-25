/* @flow */

"use strict";

import assert from "assert";
import Yadda from 'yadda';
import _ from 'underscore';
import { By } from 'selenium-webdriver';

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";

module.exports = (function() {

    async function seeTheResults(table: Array<Object>): Promise<void> {
        for (var key of _.keys(table[0])) {
            var class_ = key.match(/[(](.*)[)]/)[1];

            var expected = table.map(obj => obj[key]);
            var actual = await Promise.all((
                await this.driver.findElements(By.css(`.${class_}`))
            )
                .map(element => element.getText())
            );

            assert.deepEqual(actual, expected,
                             `${key} is not correct`);

        }
    }

    return Yadda.localisation.English.library(dictionary)
        .then('I should see the results\n$table',
              unpromisify(seeTheResults));
})();
