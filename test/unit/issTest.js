/* @flow */

/* eslint-env node, mocha */
/* eslint-disable no-use-before-define, prefer-arrow-callback */

import assert from "assert";
import { mungeUrlQuery } from "../../src/iss";
import Service from "../../fixtures/factories/Service";

describe("iss service", function() {
    describe("splitting description into sentences", function() {
        function test(input: string, output: Array<string>): Function {
            return function() {
                const service = Service({description: input});

                assert.deepEqual(
                    service.descriptionSentences(),
                    output
                );
            }
        }

        it("preserves URLs", test(
            "See our site at www.foo.com. More details are there.",
            [
                "See our site at www.foo.com.",
                "More details are there.",
            ]
        ));

        it("ends sentences with a full stop", test(
            "A description",
            ["A description."]
        ));

        it("removes trailing whitespace", test(
            "trailing whitespace    . it happens     .     ",
            ["trailing whitespace.", "it happens."]
        ));

        it("removes leading whitespace", test(
            "  leading whitespace.     also happens",
            ["leading whitespace.", "also happens."]
        ));

    })

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
                "http://example.org/?age_groups=junior&age_groups=senior",
                mungeUrlQuery(
                    "http://example.org/",
                    {age_groups: ["junior", "senior"]},
                ),
            );
        });
    });
});
