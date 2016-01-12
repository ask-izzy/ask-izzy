/* @flow */

/* eslint-env node, mocha */
/* eslint-disable no-use-before-define, prefer-arrow-callback */

import assert from "assert";
import { injectSuffixes, filterCompletions } from "../../src/locationSuggestions";

describe("Location suggestions", function() {
    describe("filtering completions", function() {

        function completion(
            types: Array<string>,
            terms: Array<string>
        ): GoogleCompletion {
            return {
                types,
                terms: terms.map((value) => ({value})),
            }
        }
        const suburb = "suburb";
        const state = "state";

        it("includes localities", function() {
            const completions = [completion(["locality"], [suburb, state])];

            assert.deepEqual(
                Array.from(filterCompletions(completions)),
                [{suburb, state}]
            );
        });

        it("includes postcodes", function() {
            const completions = [completion(["postal_code"], [state, suburb])];

            assert.deepEqual(
                Array.from(filterCompletions(completions)),
                [{suburb, state}]
            );
        });

        it("excludes other location types", function() {
            const completions = [completion(["foobar"], [state, suburb])];

            assert.deepEqual(
                Array.from(filterCompletions(completions)),
                []
            );
        });
    })

    describe("injecting suffixes", function() {
        describe("for unknown cities", function() {
            const suburb = "foo";
            const state = "bar";

            it("leaves the list alone", function() {
                assert.deepEqual(
                    Array.from(injectSuffixes([{suburb, state}])),
                    [{suburb, state}]
                )
            })
        })

        describe("for known cities", function() {
            const suburb = "Toowoomba";
            const state = "Queensland";
            const city = {suburb, state};
            const cityWithSuffix = {state, suburb: `${suburb} City`};

            describe("when the suffix is in the list", function() {
                it("moves it ahead of the city", function() {
                    assert.deepEqual(
                        Array.from(injectSuffixes([city, cityWithSuffix])),
                        [cityWithSuffix, city]
                    )
                })
            })

            describe("when the suffix is not in the list", function() {
                it("adds it ahead of the city", function() {
                    assert.deepEqual(
                        Array.from(injectSuffixes([city])),
                        [cityWithSuffix, city]
                    )
                })
            })
        })
    })
});
