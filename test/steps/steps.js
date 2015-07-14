/*
 * Step definitions for BDD tests
 */

"use strict";

import Yadda from 'yadda';

module.exports = (function() {
    return Yadda.localisation.English.library()
        .when('I visit $URL', function(url) {
            this.driver.get('http://localhost:8000/' + url);
        })

        .then('I should see "$STRING"', function(expected) {
            console.log("Do I see", expected);
        })
})();
