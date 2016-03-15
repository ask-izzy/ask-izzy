/* @flow */

/* eslint-env node, mocha */
/* eslint-disable no-use-before-define, prefer-arrow-callback */

import assert from "assert";
import { countCrisisResults } from "../../../src/components/ResultsList";

describe("Results list", function() {
    describe("counting crisis results", function() {
        const result = (crisis: boolean) => {
            return {crisis}
        };

        it("returns zero when there are none", function() {
            assert.equal(
                countCrisisResults([false, false, false].map(result)),
                0
            );
        })

        it("returns the total when all are crisis lines", function() {
            assert.equal(
                countCrisisResults([true, true, true].map(result)),
                3
            );
        })

        it("does not count crisis lines after a non-crisis", function() {
            assert.equal(
                countCrisisResults(
                    [true, true, false, true, true].map(result)
                ),
                2
            );
        })

    })
});
