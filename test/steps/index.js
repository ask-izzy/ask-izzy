/* @flow */

import type { LibraryEnglish as YaddaLibraryEnglish } from "yadda"

/*
 * Step definitions for BDD tests
 */

module.exports = ((function(): Array<YaddaLibraryEnglish> {
    // include libraries here
    return [
        require("./browser"),
        require("./branding"),
        require("./datetime"),
        require("./geolocation"),
        require("./maps"),
        require("./results"),
        require("./servicepage"),
        require("./questions"),
        require("./mocks"),
    ];
})(): Array<YaddaLibraryEnglish>);
