/* flow:disable */
/**
 * Test search composing
 */

/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback */

import assert from "assert";
import { remove } from "../../src/iss/Search";

describe("Compose personalisation search terms", function() {

    it("Adds gender flags", function() {
        let request = {
            q: "crisis accommodation",
        };

        request = require("../../src/pages/personalisation/Gender")
            .getSearchForAnswer(request, "Female");
        assert.deepEqual(request, {
            q: "crisis accommodation",
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

    it("Adds age and gender", function() {
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
            q: "crisis accommodation youth",
            client_gender: ["m", "u"],
        });
    });

    it("Removes words and add words from a search", function() {
        const request = {
            q: "substance abuse gambling",
        };
        const search = remove("gambling").append("needle exchange");

        assert.deepEqual(search.compose(request), {
            q: "substance abuse  needle exchange",
        });
    });

    it("Adds and removes service type from a search", function() {
        const request = {
            q: "help with addiction",
            service_type: ["addiction help"],
        };
        const search = remove(
            {service_type: ["addiction help", "missing type"]}
        ).append(
            {service_type: ["other help"]}
        );

        assert.deepEqual(search.compose(request), {
            q: "help with addiction",
            service_type: ["other help"],
        });
    });

});
