/* @flow */
/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback */
import assert from "assert";
import deepFreeze from "deep-freeze-strict";

import ServiceSearchCache from "../../../src/iss/ServiceSearchCache";
import type {serviceSearchResults} from "../../../src/iss/serviceSearch";
import {
    ixaService,
    phoneableService,
    housingService,
    youthSupportNetService,
    susansHouseService,
    domesticViolenceService,
    legalService,
} from "../../../fixtures/services";

describe("ISS Caching", function() {
    let serviceSearchCache: ServiceSearchCache;

    beforeEach(function() {
        serviceSearchCache = new ServiceSearchCache();
    })

    describe("A series of paginated requests", function() {
        const urls = deepFreeze([
            "/search/?area=Melbourne&limit=2",
            "/search/?area=Melbourne&limit=3&offset=2",
            "/search/?area=Melbourne&limit=2&offset=5",
            "/search/?area=Melbourne&limit=2&offset=7",
        ]);
        const defaultSearchResultsMetaProps = deepFreeze({
            total_count: 100,
            previous: "",
            available_count: 100,
            location: {
                name: "",
                suburb: "",
                state: "",
                lat: 0,
                lon: 0,
            },
        })
        const responses: Array<serviceSearchResults> = deepFreeze([
            {
                meta: {
                    ...defaultSearchResultsMetaProps,
                    limit: 2,
                    offset: 0,
                    next: urls[1],
                },
                services: [ixaService, phoneableService],
            },
            {
                meta: {
                    ...defaultSearchResultsMetaProps,
                    limit: 3,
                    offset: 2,
                    next: urls[2],
                },
                services: [
                    housingService,
                    youthSupportNetService,
                    susansHouseService,
                ],
            },
            {
                meta: {
                    ...defaultSearchResultsMetaProps,
                    limit: 2,
                    offset: 5,
                    next: urls[3],
                },
                services: [domesticViolenceService, legalService],
            },
        ]);

        it("Initially has no hit for the urls", function() {
            assert(!serviceSearchCache.getPageForQuery(urls[0]));
            assert(!serviceSearchCache.getPageForQuery(urls[1]));
            assert(!serviceSearchCache.getPageForQuery(urls[2]));
        });

        it("Stores page 1 after the initial request", function() {
            serviceSearchCache.revise(urls[0], responses[0]);
            assert.deepEqual(
                serviceSearchCache.getPageForQuery(urls[0]),
                responses[0]
            );
        });

        it("misses page 2 after loading page 1", function() {
            serviceSearchCache.revise(urls[0], responses[0]);
            assert(!serviceSearchCache.getPageForQuery(urls[1]));
        });

        it("misses page 3 after loading page 1 & 2", function() {
            serviceSearchCache.revise(urls[0], responses[0]);
            serviceSearchCache.revise(urls[1], responses[1]);
            assert(!serviceSearchCache.getPageForQuery(urls[2]));
        });

        it("merges results from multiple paginated URLs", function() {
            serviceSearchCache.revise(urls[0], responses[0]);
            serviceSearchCache.revise(urls[1], responses[1]);
            serviceSearchCache.revise(urls[2], responses[2]);

            const expected: serviceSearchResults = {
                meta: {
                    ...defaultSearchResultsMetaProps,
                    offset: 0,
                    limit: 2,
                    next: urls[3],
                },
                services: [
                    ixaService,
                    phoneableService,
                    housingService,
                    youthSupportNetService,
                    susansHouseService,
                    domesticViolenceService,
                    legalService,
                ],
            };

            assert.deepEqual(
                serviceSearchCache.getAllPagesForQuery(urls[0]),
                expected
            );
            assert.deepEqual(
                serviceSearchCache.getAllPagesForQuery(urls[1]),
                expected
            );
            assert.deepEqual(
                serviceSearchCache.getAllPagesForQuery(urls[2]),
                expected
            );
        });
    })

});
