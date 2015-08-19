/*
 * Step definitions for Selenium/browser related steps
 */

"use strict";

import Yadda from 'yadda';
import { By } from 'selenium-webdriver';
import unpromisify from "../support/yadda-promise";
import * as assert from '../support/page-assertions';

module.exports = (function() {
    return Yadda.localisation.English.library()
        .when('I visit $URL', unpromisify(visitUrl))
        .then('I should see "$STRING"', unpromisify(thenISee));
})();

async function visitUrl(url) {
    var port = process.env.PORT || 8000;
    return this.driver.get(`http://localhost:${port}${url}`);
}

async function thenISee(expected) {
    await assert.textIsVisible(this.driver, expected);
}
