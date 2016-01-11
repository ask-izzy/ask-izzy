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
            q: "crisis accommodation females",
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
        request = pages.Age.getSearchForAnswer(request, "26 to 39");
        assert.deepEqual(request, {
            q: "crisis accommodation adults",
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
        request = pages.Age.getSearchForAnswer(request, "26 to 39");
        assert.deepEqual(request, {
            q: "crisis accommodation males adults",
            age_groups: ["adult"],
            client_gender: ["m", "u"],
        });
    });

    it("Remove words and add words from a search", function() {
        const {
            remove,
        } = require("../../src/pages/personalisation/BaseQuestion");
        const request = {
            q: "substance abuse gambling",
        };
        const search = remove("gambling").append("needle exchange");

        assert.deepEqual(search.compose(request), {
            q: "substance abuse  needle exchange",
        });
    });

    it("Remove service type from a search", function() {
        const {
            remove,
        } = require("../../src/pages/personalisation/BaseQuestion");
        const request = {
            q: "help with addiction",
            service_type: "addiction help",
        };
        const search = remove({service_type: "addiction help"});

        assert.deepEqual(search.compose(request), {
            q: "help with addiction",
        });
    });

});
