/* eslint-disable no-use-before-define, prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";
import { countCrisisResults } from "../../src/iss/crisisService";
import getServiceFixture from "../../fixtures/factories/Service";

test.describe("iss service", function() {

    test.describe("Identifying indigenous services", function() {

        test.describe("by classification", function() {
            test("if type is 'culturally_safe'", function() {
                assert(!getServiceFixture({
                    indigenous_classification: "culturally_safe",
                }).Indigenous());
            });
            test("if type is 'mainstream_who_cater'", function() {
                assert(getServiceFixture({
                    indigenous_classification: "mainstream_who_cater",
                }).Indigenous());
            });
            test("if type is 'specific'", function() {
                assert(getServiceFixture({
                    indigenous_classification: "specific",
                }).Indigenous());
            });
            test("if type is 'mainstream'", function() {
                assert(!getServiceFixture({
                    indigenous_classification: "mainstream",
                }).Indigenous());
            });
        });


    });

    test.describe("splitting description into sentences", function() {
        function testSentences(input: string, output: Array<string>): () => void {
            return function() {
                const service = getServiceFixture({description: input});

                assert.deepStrictEqual(
                    service.descriptionSentences,
                    output
                );
            }
        }

        test("preserves URLs", testSentences(
            "See our site at www.foo.com. More details are there.",
            [
                "See our site at www.foo.com. ",
                "More details are there.",
            ]
        ));

        test("preserves all characters", testSentences(
            "  leading whitespace.  happens  .   also trailing whitespace    ",
            [
                "  leading whitespace.  ",
                "happens  .   ",
                "also trailing whitespace    ",
            ]
        ));

        test("deals with newlines", testSentences(
            "First line and\n second line. Second sentence.",
            [
                "First line and\n second line. ",
                "Second sentence.",
            ]
        ));

    })

    test.describe("counting crisis results", function() {
        const result = (crisis: boolean) => {
            return getServiceFixture({is_crisis: crisis})
        };

        test("returns zero when there are none", function() {
            const results = [false, false, false].map(result);

            assert.equal(countCrisisResults(results), 0);
        })

        test("returns the total when all are crisis lines", function() {
            const results = [true, true, true].map(result);

            assert.equal(countCrisisResults(results), 3);
        })

        test("does not count crisis lines after a non-crisis", function() {
            const results = [true, true, false, true, true].map(result);

            assert.equal(countCrisisResults(results), 2);
        })

    })

});
