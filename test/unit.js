/* $FlowIgnore */

/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback */
require("regenerator-runtime/runtime");
import Yadda from "yadda";

describe("Unit tests", function() {
    new Yadda.FileSearch(
        "./test/unit",
        /.*\.js$/
    ).each(file => require("../" + file));
});
