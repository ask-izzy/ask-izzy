/* flow:disable */
/**
 * Test search composing
 */

/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback */

import assert from "assert";

describe("Compose personalisation search terms", function() {

    it("Adds gender flags", function() {
        let request = {
            q: "crisis accommodation",
        };

        request = require("../../src/pages/personalisation/Gender")
            .getSearchForAnswer(request, "Female");
        assert.deepEqual(request, {
            q: "crisis accommodation females",
            client_gender: ["f", "u"],
        });
    });

    it("Adds age groups", function() {
        let request = {
            q: "crisis accommodation",
        };

        request = require("../../src/pages/personalisation/Age")
            .getSearchForAnswer(request, "25 or younger");
        assert.deepEqual(request, {
            q: "crisis accommodation youth",
        });
    });

    it("Add age and gender", function() {
        let request = {
            q: "crisis accommodation",
        };

        request = require("../../src/pages/personalisation/Gender")
            .getSearchForAnswer(request, "Male");
        if (!request) {
            throw new Error("unexpected");
        }

        request = require("../../src/pages/personalisation/Age")
            .getSearchForAnswer(request, "25 or younger");
        assert.deepEqual(request, {
            q: "crisis accommodation males youth",
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
