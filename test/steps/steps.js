/*
 * Step definitions for BDD tests
 */

"use strict";

import Yadda from "yadda";

module.exports = (function() {
    return Yadda.localisation.English.library()
        .when('I visit $URL', url => {
            console.log("Visiting", url);
        })

        .then('I should see "$STRING"', expected => {
            console.log("Do I see", expected);
        });
})();
