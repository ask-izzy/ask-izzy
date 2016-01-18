/* flow:disable */

/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback */

import Yadda from "yadda";

describe("Unit tests", function() {
    new Yadda.FileSearch(
        "./test/unit",
        /.*\.js$/
        ).each(file => require("../" + file));
});
