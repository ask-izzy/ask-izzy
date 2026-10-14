/* eslint-disable no-use-before-define, prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";
import { countCrisisResults } from "../../src/iss/crisisService";
import getServiceFixture from "../../fixtures/factories/Service";

test.describe("iss service", function() {

    test.describe("Identifying indigenous services", function() {

        test.describe("by classification", function() {

            const culturalySafe =
                "Culturally safe for Aboriginal (indigenous)";
            const mainstreamCaterAboriginal =
                "Mainstream who cater for Aboriginal (indigenous)"
            const aboriginalSpecific = "Aboriginal (indigenous) specific"

            test("if type is 'Culturally safe for Aboriginal'", function() {
                assert(!getServiceFixture({
                    indigenous_classification: [culturalySafe],
                }).Indigenous());
            });
            test("if type is 'Mainstream who cater Aboriginal'", function() {
                assert(getServiceFixture(
                    {indigenous_classification:
                        [mainstreamCaterAboriginal],
                    }).Indigenous());
            });
            test("if type is 'Aboriginal (indigenous) specific'", function() {
                assert(getServiceFixture({
                    indigenous_classification: [aboriginalSpecific],
                }).Indigenous());
            });
            test("if type is 'Mainstream'", function() {
                assert(!getServiceFixture({
                    indigenous_classification: ["Mainstream"],
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
            return getServiceFixture({crisis: crisis})
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
