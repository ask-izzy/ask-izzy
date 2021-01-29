/* $FlowIgnore */
/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback */

import assert from "assert";
import Cache from "../../../src/iss/Cache";

describe("ISS Caching", function() {
    let cache = new Cache(); // Keep flow happy

    beforeEach(function() {
        cache = new Cache();
    })

    describe("A series of paginated requests", function() {
        let urls = [];
        let responses = [];

        beforeEach(function() {
            urls = [
                "/search/?area=Melbourne&limit=10",
                "/search/?area=Melbourne&limit=10&offset=1",
                "/search/?area=Melbourne&limit=10&offset=2",
            ]
            responses = [
                {meta: {next: urls[1]}, objects: [0]},
                {meta: {next: urls[2]}, objects: [1]},
                {meta: {}, objects: [2]},
            ];
        })

        it("Initially has no hit for the urls", function() {
            assert(!cache.exactHit(urls[0]));
            assert(!cache.exactHit(urls[1]));
            assert(!cache.exactHit(urls[2]));
        });

        it("Stores page 1 after the initial request", function() {
            cache.revise(urls[0], responses[0]);
            assert.equal(cache.exactHit(urls[0]), responses[0]);
        });

        it("misses page 2 after loading page 1", function() {
            cache.revise(urls[0], responses[0]);
            assert(!cache.exactHit(urls[1]));
        });

        it("misses page 3 after loading page 1 & 2", function() {
            cache.revise(urls[0], responses[0]);
            cache.revise(urls[1], responses[1]);
            assert(!cache.exactHit(urls[2]));
        });

        it("merges results from multiple paginated URLs", function() {
            cache.revise(urls[0], responses[0]);
            cache.revise(urls[1], responses[1]);
            cache.revise(urls[2], responses[2]);

            const expected = {
                meta: {next: undefined, available_count: 3},
                objects: [0, 1, 2],
            };

            assert.deepEqual(cache.exactHit(urls[0]), expected);
            assert.deepEqual(cache.exactHit(urls[1]), expected);
            assert.deepEqual(cache.exactHit(urls[2]), expected);
        });
    })

});
