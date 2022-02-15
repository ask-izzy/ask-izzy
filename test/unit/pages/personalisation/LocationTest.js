/* @flow */
/* eslint-env node, mocha */

import assert from "assert";
import Location from "../../../../src/pages/personalisation/Location";
import storage from "../../../../src/storage";

describe("location personalisation", () => {

    describe("shouldInjectAccessPoints", () => {

        it("injects access points for Melbourne, VIC", () => {
            storage.setSearchArea("Melbourne, VIC");
            assert(Location.shouldInjectAccessPoints());
        });

        it("injects access points for Melbourne, Victoria", () => {
            storage.setSearchArea("Melbourne, Victoria");
            assert(Location.shouldInjectAccessPoints());
        });

        it("does not inject access points for Christmas Island", () => {
            storage.setSearchArea("Christmas Island");
            assert(!Location.shouldInjectAccessPoints());
        });
    });

});

