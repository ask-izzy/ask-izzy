/*
 * Step definitions for Basic Search
 */

"use strict";

import Yadda from 'yadda';
import { By } from 'selenium-webdriver';
import unpromisify from "../support/yadda-promise";
import * as assert from '../support/page-assertions';
import { within } from '../support/selectors';

module.exports = (function() {
    return Yadda.localisation.English.library()
        .when('I search for $query', unpromisify(searchForQuery))
        .then('I should see the results for "$query"',
            unpromisify(resultForQuery));
})();

async function searchForQuery(query) {
    const element = await this.driver.findElement(By.xpath(
        `//*[@id="search-box"]`
    ));
    await element.sendKeys(query);

    // FIXME: This doesn't submit the search.
    // Do we need a button or something?
}

async function resultForQuery(query) {
    console.log("FIXME: Search is not implemented yet.");
}
