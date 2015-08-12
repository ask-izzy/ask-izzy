/*
 * Step definitions for Selenium/browser related steps
 */

"use strict";

import Yadda from 'yadda';
import { By } from 'selenium-webdriver';
import unpromisify from "../support/yadda-promise";

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
    const element = await this.driver.findElement(By.xpath(
      `//*[normalize-space(text()) = normalize-space('${expected}')]`
    ));
    const visible = await element.isDisplayed();
    if (!visible) {
        throw new Error(
            `Text ${expected} was present but not visible`
        );
    }
}
