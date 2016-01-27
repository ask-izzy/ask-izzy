/* @flow */

/* eslint-env node, mocha */
/* eslint-disable no-use-before-define, prefer-arrow-callback */

import assert from "assert";
import { mungeUrlQuery } from "../../src/iss";

describe("iss service", function() {
    describe("Munging URLs", function() {

        it("Preserves unrelated query params", function() {
            assert.equal(
                "http://example.org/?a=b&c=d",
                mungeUrlQuery(
                    "http://example.org/?a=b",
                    {c: "d"},
                ),
            );
        });

        it("Overrides query params", function() {
            assert.equal(
                "http://example.org/?a=c",
                mungeUrlQuery(
                    "http://example.org/?a=b",
                    {a: "c"},
                ),
            );
        });

        it("Converts auth params to &key=", function() {
            assert.equal(
                "http://example.org/?key=bob%3AalICE",
                mungeUrlQuery(
                    "http://bob:alICE@example.org/",
                    {},
                ),
            );
        });

        it("Sends arrays multiple times", function() {
            assert.equal(
                "http://example.org/?age_group=junior&age_group=senior",
                mungeUrlQuery(
                    "http://example.org/",
                    {age_group: ["junior", "senior"]},
                ),
            );
        });
    });
});
