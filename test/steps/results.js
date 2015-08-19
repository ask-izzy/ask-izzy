"use strict";

import Yadda from 'yadda';

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";

module.exports = (function() {

    async function seeTheResults(table) {
        console.log(table);
    }

    return Yadda.localisation.English.library(dictionary)
        .then('I should see the results\n$table',
              unpromisify(seeTheResults));
})();
