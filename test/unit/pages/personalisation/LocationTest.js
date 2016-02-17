/* @flow */

/* eslint-env node, mocha */

import assert from "assert";
import Location from "../../../../src/pages/personalisation/Location";
import storage from "../../../../src/storage";

describe("location personalisation", () => {
    describe("shouldEnableCatchment", () => {

        it("has catchments for Hobart, TAS", () => {
            storage.setLocation("Hobart, TAS");
            assert(Location.shouldEnableCatchment());
        });

        it("has catchments for Hobart, Tasmania", () => {
            storage.setLocation("Hobart, Tasmania");
            assert(Location.shouldEnableCatchment());
        });

        it("disables catchments for Christmas Island", () => {
            storage.setLocation("Christmas Island");
            assert(!Location.shouldEnableCatchment());
        });

    });
});

