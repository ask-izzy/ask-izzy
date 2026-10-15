/* eslint-disable prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";
import { convertIzzySearchQueryToIss } from "../../../src/iss/serviceSearch";
import { SEARCH_RESULT_FIELDS } from "../../../src/iss/Service";

test.describe("Converting an Izzy search query to an ISS query", function() {
    test("always requests only the fields used", function() {
        assert.deepStrictEqual(
            convertIzzySearchQueryToIss({}),
            {fields: SEARCH_RESULT_FIELDS}
        )
    })

    test("maps all supported properties", function() {
        const {fields, ...issQuery} = convertIzzySearchQueryToIss({
            term: ["food", "-\"pet food\""],
            serviceTypes: ["Food", "Meals"],
            clientGenders: ["Female", "Male", "Diverse", "unspecified"],
            ageGroups: ["Young Adult", "unspecified"],
            caldSpecific: false,
            indigenousClassification: ["specific", "mainstream_who_cater"],
            siteId: 111,
            name: "centrelink",
            location: {
                name: "Richmond, VIC",
                coordinates: {
                    name: "Richmond, VIC",
                    latitude: -37.8,
                    longitude: 144.9,
                },
            },
        })

        assert.deepStrictEqual(issQuery, {
            "search-terms": "food -\"pet food\"",
            "service-type": ["Food", "Meals"],
            "target-gender": ["female", "male", "other", "unspecified"],
            "age-group": ["Young Adult"],
            "is-cald-specific": false,
            "indigenous-classification": ["specific", "mainstream_who_cater"],
            site: "111",
            name: "centrelink",
            "located-near": "-37.8,144.9",
        })
    })

    test("uses the location name when there are no coordinates", function() {
        const issQuery = convertIzzySearchQueryToIss({
            location: {name: "Carlton North, VIC"},
        })
        assert.equal(issQuery["located-near"], "carlton north,vic")
    })

    test("filters by catchment", function() {
        const issQuery = convertIzzySearchQueryToIss({
            location: {name: "Richmond, VIC"},
            catchment: "true",
        })
        assert.equal(issQuery.catchment, "richmond,vic")
        assert.equal(issQuery["prefer-catchment"], undefined)
    })

    test("prefers catchment", function() {
        const issQuery = convertIzzySearchQueryToIss({
            location: {name: "Richmond, VIC"},
            catchment: "prefer",
        })
        assert.equal(issQuery["prefer-catchment"], "richmond,vic")
        assert.equal(issQuery.catchment, undefined)
    })

    test("ignores catchment when it's false", function() {
        const issQuery = convertIzzySearchQueryToIss({
            location: {name: "Richmond, VIC"},
            catchment: "false",
        })
        assert.equal(issQuery.catchment, undefined)
        assert.equal(issQuery["prefer-catchment"], undefined)
    })
})
