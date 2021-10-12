/* @flow */
/**
 * Test search composing
 */

/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback */

import assert from "assert";
import { remove } from "../../src/iss/ServiceSearchRequest";

describe("Compose personalisation search terms", function() {

    it("Adds gender flags", function() {
        let request = {
            q: "crisis accommodation",
        };

        request = require("../../src/pages/personalisation/Gender").default
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

        request = require("../../src/pages/personalisation/Age").default
            .getSearchForAnswer(request, "18 to 26");
        assert.deepEqual(request, {
            q: "crisis accommodation",
            age_group: [
                "unspecified",
                "youngadult",
            ],
        });
    });

    it("Adds age and gender", function(): void {
        let request = {
            q: "crisis accommodation",
        };

        request = require("../../src/pages/personalisation/Gender").default
            .getSearchForAnswer(request, "Male");
        if (!request) {
            throw new Error("unexpected");
        }

        request = require("../../src/pages/personalisation/Age").default
            .getSearchForAnswer(request, "18 to 26");
        assert.deepEqual(request, {
            q: "crisis accommodation",
            client_gender: ["m", "u"],
            age_group: [
                "unspecified",
                "youngadult",
            ],
        });
    });

    it("Removes words from, and adds words to, a search", function() {
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
            service_type: ["addiction help", "addiction service"],
        };
        const search = remove(
            {service_type: ["addiction help", "missing type"]}
        ).append(
            {service_type: ["other help"]}
        ).remove(
            {service_type: ["addiction service"]}
        );

        assert.deepEqual(search.compose(request), {
            q: "help with addiction",
            service_type: ["other help"],
        });
    });

});
