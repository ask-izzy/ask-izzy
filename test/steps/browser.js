/*
 * Step definitions for Selenium/browser related steps
 */

"use strict";

import Yadda from 'yadda';
import { By } from 'selenium-webdriver';

module.exports = (function() {
    return Yadda.localisation.English.library()
        .when('I visit $URL', function(url) {
            return this.driver.get(`http://localhost:8000${url}`);
        })

        .then('I should see "$STRING"', function(expected) {
            const element = this.driver.findElement(By.xpath(
              `//*[normalize-space(text()) = normalize-space('${expected}')]`
            ));
            async function checkVisible() {
                const visible = await element.isDisplayed();
                if (!visible) {
                    throw new Error(
                        `Text ${expected} was present but not visible`
                    );
                }
            }

            return checkVisible();
        });
})();
