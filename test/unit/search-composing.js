/* @flow */
/**
 * Test search composing
 */

/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback */

import assert from "assert";

describe("Compose personalisation search terms", function() {

    it("Add gender flags", function() {
        // Can't import this globally as it triggers a circular dependency
        const pages = require("../../src/pages/personalisation");
        let request = {
            q: "crisis accommodation",
        };

        // flow:disable -- flow is confused about exports
        request = pages.Gender.getSearchForAnswer(request, "Female");
        assert.deepEqual(request, {
            q: "crisis accommodation -male",
            age_groups: [],
        });

    });
});
