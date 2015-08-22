/*
 * Step definitions for Selenium/browser related steps
 */

/* @flow */

"use strict";

import Yadda from 'yadda';
import { By } from 'selenium-webdriver';

import * as assert from '../support/page-assertions';
import unpromisify from '../support/yadda-promise';
import { gotoUrl } from '../support/webdriver';

module.exports = (function() {
    return Yadda.localisation.English.library()
        .when('I visit $URL', unpromisify(visitUrl))
        .then('I should see "$STRING"', unpromisify(thenISee));
})();

async function visitUrl(url: string): Promise {
    await gotoUrl(this.driver, url);
}

async function thenISee(expected: string): Promise {
    await assert.textIsVisible(this.driver, expected);
}
