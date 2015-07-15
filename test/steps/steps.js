/*
 * Step definitions for BDD tests
 */

"use strict";

import Yadda from 'yadda';
import { By } from 'selenium-webdriver';

module.exports = (function() {
    return Yadda.localisation.English.library()
        .when('I visit $URL', function(url) {
            this.driver.get('http://localhost:8000' + url);
        })

        .then('I should see "$STRING"', function(expected) {
            this.driver.findElement(By.xpath(
              `//*[normalize-space(text()) = normalize-space('${expected}')]`
            ));
        });
})();
