/*
 * Step definitions for Selenium/browser related steps
 */

"use strict";

import Yadda from 'yadda';
import { By } from 'selenium-webdriver';

module.exports = (function() {
    return Yadda.localisation.English.library()
        .when('I visit $URL', function(url, next) {
            this.driver.get(`http://localhost:8000${url}`);
        })

        .then('I should see "$STRING"', function(expected) {
            // FIXME: this is wrong because it doesn't check the element
            // returned is visible
            this.driver.findElement(By.xpath(
              `//*[normalize-space(text()) = normalize-space('${expected}')]`
            ));
        });
})();
