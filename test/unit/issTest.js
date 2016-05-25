/* @flow */

/* eslint-env node, mocha */
/* eslint-disable no-use-before-define, prefer-arrow-callback */

import assert from "assert";
import { mungeUrlQuery, countCrisisResults } from "../../src/iss";
import Service from "../../fixtures/factories/Service";

describe("iss service", function() {

    describe("Identifying indigenous services", function() {
        const testCases = [
            "housing for Indigenous australians",
            "housing for indigenous australians",
            "Koori health program",
            "koori health program",
            "Aboriginal",
            "Aboriginals",
            "Torres Strait Islander",
            "Torres Strait Islanders",
        ]

        testCases.forEach((str) =>
            describe(`by the word ${str}`, function() {
                it("finds it in the description", function() {
                    assert(Service({description: str}).Indigenous())
                })
                it("finds it in the name", function() {
                    assert(Service({name: str}).Indigenous())
                })
                it("finds it in the site name", function() {
                    assert(Service({site: {name: str}}).Indigenous())
                })
            })
        )

    })

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
                "http://example.org/?age_group=junior&age_group=senior",
                mungeUrlQuery(
                    "http://example.org/",
                    {age_group: ["junior", "senior"]},
                ),
            );
        });
    });

    describe("counting crisis results", function() {
        const result = (crisis: boolean) => {
            return Service({crisis: crisis})
        };

        it("returns zero when there are none", function() {
            const results = [false, false, false].map(result);

            assert.equal(countCrisisResults(results), 0);
        })

        it("returns the total when all are crisis lines", function() {
            const results = [true, true, true].map(result);

            assert.equal(countCrisisResults(results), 3);
        })

        it("does not count crisis lines after a non-crisis", function() {
            const results = [true, true, false, true, true].map(result);

            assert.equal(countCrisisResults(results), 2);
        })

    })

});
