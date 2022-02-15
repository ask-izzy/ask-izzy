/* @flow */
/* eslint-env node, mocha */
/* eslint-disable no-use-before-define, prefer-arrow-callback */

import assert from "assert";
import { countCrisisResults } from "../../src/services/crisisService";
import getServiceFixture from "../../fixtures/factories/Service";

describe("iss service", function() {

    describe("Identifying indigenous services", function() {

        describe("by classification", function() {

            const culturalySafe =
                "Culturally safe for Aboriginal (indigenous)";
            const mainstreamCaterAboriginal =
                "Mainstream who cater for Aboriginal (indigenous)"
            const aboriginalSpecific = "Aboriginal (indigenous) specific"

            it("if type is 'Culturally safe for Aboriginal'", function() {
                assert(!getServiceFixture({
                    indigenous_classification: [culturalySafe],
                }).Indigenous());
            });
            it("if type is 'Mainstream who cater Aboriginal'", function() {
                assert(getServiceFixture(
                    {indigenous_classification:
                        [mainstreamCaterAboriginal],
                    }).Indigenous());
            });
            it("if type is 'Aboriginal (indigenous) specific'", function() {
                assert(getServiceFixture({
                    indigenous_classification: [aboriginalSpecific],
                }).Indigenous());
            });
            it("if type is 'Mainstream'", function() {
                assert(!getServiceFixture({
                    indigenous_classification: ["Mainstream"],
                }).Indigenous());
            });
        });


    });

    describe("splitting description into sentences", function() {
        function test(input: string, output: Array<string>): Function {
            return function() {
                const service = getServiceFixture({description: input});

                assert.deepEqual(
                    service.descriptionSentences,
                    output
                );
            }
        }

        it("preserves URLs", test(
            "See our site at www.foo.com. More details are there.",
            [
                "See our site at www.foo.com. ",
                "More details are there.",
            ]
        ));

        it("preserves all characters", test(
            "  leading whitespace.  happens  .   also trailing whitespace    ",
            [
                "  leading whitespace.  ",
                "happens  .   ",
                "also trailing whitespace    ",
            ]
        ));

        it("deals with newlines", test(
            "First line and\n second line. Second sentence.",
            [
                "First line and\n second line. ",
                "Second sentence.",
            ]
        ));

    })

    describe("counting crisis results", function() {
        const result = (crisis: boolean) => {
            return getServiceFixture({crisis: crisis})
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
