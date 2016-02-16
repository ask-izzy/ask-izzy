/* @flow */

/* eslint-env node, mocha */

import assert from "assert";
import Location from "../../../../src/pages/personalisation/Location";
import storage from "../../../../src/storage";

describe("location personalisation", function() {
    describe("shouldEnableCatchment", function() {

        it("has catchments for Hobart, TAS", function() {
            storage.setLocation("Hobart, TAS");
            assert(Location.shouldEnableCatchment());
        });

        it("has catchments for Hobart, Tasmania", function() {
            storage.setLocation("Hobart, Tasmania");
            assert(Location.shouldEnableCatchment());
        });

        it("disables catchments for Christmas Island", function() {
            storage.setLocation("Christmas Island");
            assert(!Location.shouldEnableCatchment());
        });

    });
});

