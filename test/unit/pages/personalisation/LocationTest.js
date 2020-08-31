/* $FlowIgnore */
/* eslint-env node, mocha */

import assert from "assert";
import Location, {
    mergeAccessPoints,
} from "../../../../src/pages/personalisation/Location";
import Service from "../../../../fixtures/factories/Service";
import storage from "../../../../src/storage";

describe("location personalisation", () => {

    describe("shouldInjectAccessPoints", () => {

        it("injects access points for Melbourne, VIC", () => {
            storage.setLocation("Melbourne, VIC");
            assert(Location.shouldInjectAccessPoints());
        });

        it("injects access points for Melbourne, Victoria", () => {
            storage.setLocation("Melbourne, Victoria");
            assert(Location.shouldInjectAccessPoints());
        });

        it("does not inject access points for Christmas Island", () => {
            storage.setLocation("Christmas Island");
            assert(!Location.shouldInjectAccessPoints());
        });
    });

    describe("merging housing access points into search results", () => {
        const origLocation = {
            name: "original",
            suburb: "original",
            state: "original",
            lat: 1,
            lon: 1,
        };
        const baseResults = {
            meta: {
                total_count: 100,
                available_count: 4,
                next: "original",
                previous: "original",
                limit: 10,
                offset: 0,
                location: origLocation,
            },
            objects: [
                Service({crisis: true, id: 1}),
                Service({crisis: false, id: 4}),
                // id 5 does not count as a crisis line
                // as it comes after a non-crisis line
                Service({crisis: true, id: 5}),
                Service({crisis: false, id: 6}),
            ],
        };
        const extraResults = {
            meta: {
                total_count: 3,
                available_count: 3,
                next: "extra",
                previous: "extra",
                limit: 5,
                offset: 5,
                location: {...origLocation, name: "extra"},
            },
            objects: [
                Service({crisis: true, id: 1}),
                Service({id: 2}),
                Service({id: 3}),
            ],
        };
        const merged = mergeAccessPoints(baseResults, extraResults);

        it("merges the total_count", () => {
            assert.equal(
                merged.meta.total_count,
                102
            )
        });

        it("merges the available_count", () => {
            assert.equal(merged.meta.available_count, 6)
        });

        it("preserves the meta from the original", () => {
            assert.equal(merged.meta.next, baseResults.meta.next);
            assert.equal(merged.meta.previous, baseResults.meta.previous);
            assert.equal(merged.meta.limit, baseResults.meta.limit);
            assert.equal(merged.meta.offset, baseResults.meta.offset);
            assert.equal(merged.meta.location, baseResults.meta.location);
        });

        it("puts the services in the right order", () => {
            assert.deepEqual(
                merged.objects.map(({id}) => id),
                [1, 2, 3, 4, 5, 6]
            )
        });

    });

});

