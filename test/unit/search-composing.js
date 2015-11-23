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
            q: "crisis accommodation",
            client_gender: ["f", "u"],
        });
    });

    it("Add age groups", function() {
        // Can't import this globally as it triggers a circular dependency
        const pages = require("../../src/pages/personalisation");
        let request = {
            q: "crisis accommodation",
        };

        // flow:disable -- flow is confused about exports
        request = pages.Age.getSearchForAnswer(request, "26 to 40");
        assert.deepEqual(request, {
            q: "crisis accommodation",
            age_groups: ["adult"],
        });
    });

    it("Add age and gender", function() {
        // Can't import this globally as it triggers a circular dependency
        const pages = require("../../src/pages/personalisation");
        let request = {
            q: "crisis accommodation",
        };

        // flow:disable -- flow is confused about exports
        request = pages.Gender.getSearchForAnswer(request, "Male");
        // flow:disable -- flow is confused about exports
        request = pages.Age.getSearchForAnswer(request, "26 to 40");
        assert.deepEqual(request, {
            q: "crisis accommodation",
            age_groups: ["adult"],
            client_gender: ["m", "u"],
        });
    });

    it("Remove words and add words from a search", function() {
        const pages = require("../../src/pages/personalisation");
        let request = {
            q: "substance abuse gambling",
        };

        // flow:disable -- flow is confused about exports
        request = pages.AddictionSubcategories.getSearchForAnswer(
            request, new Set(["Detox", "Rehab"])
        );
        assert.deepEqual(request, {
            q: "substance abuse  detox rehab",  // FIXME: normalise space
        });
    });

    it("Replace search phrase entirely", function() {
        const pages = require("../../src/pages/personalisation");
        let request = {
            q: "substance abuse gambling",
        };

        // flow:disable -- flow is confused about exports
        request = pages.AddictionSubcategories.getSearchForAnswer(
            request, new Set(["Needle exchange"])
        );
        assert.deepEqual(request, {
            q: " needle exchange",
        });
    });
});
