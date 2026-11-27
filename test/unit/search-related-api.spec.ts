/* eslint-disable prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";

import {handleRelatedSearchesRequest} from "../../src/related-searches/api";
import type {RelatedSearchesDependencies} from "../../src/related-searches/api";
import type {RelatedSearchFlows} from "../../src/related-searches/flows";

const flows: RelatedSearchFlows = {
    "meals": {category: "food", answers: {"food-subcategory": "Meals"}},
    "housing -(coordinating bodies) -(respite care)": {
        category: "housing",
        answers: {"sleep-tonight": "Yes"},
    },
    "housing (rental assistance)": {
        category: "housing",
        answers: {"sleep-tonight": "No"},
    },
}

/** @see docs/other-services-panel.md § "Ask Izzy's related searches endpoint" */
test.describe("POST /api/search/related", function() {
    const originalError = console.error
    let fetchedQs: Array<string>

    function dependencies(
        relatedSearches: Array<string> | Error,
    ): RelatedSearchesDependencies {
        return {
            async fetchRelatedSearches(q) {
                fetchedQs.push(q)
                if (relatedSearches instanceof Error) {
                    throw relatedSearches
                }
                return relatedSearches
            },
            getFlows: () => flows,
        }
    }

    test.beforeEach(() => {
        fetchedQs = []
        console.error = () => {}
    })

    test.afterEach(() => {
        console.error = originalError
    })

    test("returns suggestions for the related searches of q", async() => {
        const result = await handleRelatedSearchesRequest(
            "POST",
            {q: "(food vouchers)"},
            dependencies(["meals", "relief"]),
        )

        assert.deepStrictEqual(fetchedQs, ["(food vouchers)"])
        assert.deepStrictEqual(result, {
            status: 200,
            body: {
                suggestions: [
                    {
                        label: "Meals",
                        target: {
                            type: "category",
                            categoryKey: "food",
                            answers: {"food-subcategory": "Meals"},
                        },
                    },
                    {
                        label: "relief",
                        target: {type: "search", searchText: "relief"},
                    },
                ],
            },
        })
    })

    test("returns no suggestions when getting related searches fails", async() => {
        const result = await handleRelatedSearchesRequest(
            "POST",
            {q: "meals"},
            dependencies(new Error("ISS4 down")),
        )

        assert.deepStrictEqual(result, {status: 200, body: {suggestions: []}})
    })

    test("doesn't need the lookup table when there are no related searches", async() => {
        const result = await handleRelatedSearchesRequest(
            "POST",
            {q: "meals"},
            {
                fetchRelatedSearches: async() => [],
                getFlows: () => {
                    throw new Error("Shouldn't be loaded")
                },
            },
        )

        assert.deepStrictEqual(result, {status: 200, body: {suggestions: []}})
    })

    /** @see docs/other-services-panel.md § "Labelling suggestions" */
    test("labels suggestions relative to the current category and answers", async() => {
        const result = await handleRelatedSearchesRequest(
            "POST",
            {
                q: "housing -(coordinating bodies) -(respite care)",
                currentCategory: "housing",
                currentAnswers: {"sleep-tonight": "Yes"},
            },
            dependencies(["housing (rental assistance)"]),
        )

        assert.deepStrictEqual(
            "suggestions" in result.body &&
                result.body.suggestions.map(suggestion => suggestion.label),
            ["Housing for people not safe tonight"],
        )
    })

    test("ignores answers to unknown pages and answers which aren't strings", async() => {
        const result = await handleRelatedSearchesRequest(
            "POST",
            {
                q: "meals",
                currentCategory: "food",
                currentAnswers: {
                    "sleep-tonight": 3,
                    "demographics": ["Couples", null],
                    "not-a-page": "Yes",
                },
            },
            dependencies([
                "housing (rental assistance)",
                "housing -(coordinating bodies) -(respite care)",
            ]),
        )

        // With no valid saved sleep tonight answer both are mentioned
        assert.deepStrictEqual(
            "suggestions" in result.body &&
                result.body.suggestions.map(suggestion => suggestion.label),
            ["Housing for people not safe tonight", "Housing for people safe tonight"],
        )
    })

    test("only accepts POST", async() => {
        const result = await handleRelatedSearchesRequest(
            "GET",
            {q: "meals"},
            dependencies([]),
        )

        assert.strictEqual(result.status, 405)
        assert.deepStrictEqual(fetchedQs, [])
    })

    const invalidBodies: Array<[string, unknown]> = [
        ["no body", undefined],
        ["a body which isn't an object", ["meals"]],
        ["no q", {}],
        ["an empty q", {q: "  "}],
        ["a q which isn't a string", {q: 3}],
        ["an unknown current category", {q: "meals", currentCategory: "nope"}],
        ["a current category which isn't a string", {q: "meals", currentCategory: 1}],
    ]
    invalidBodies.forEach(([description, body]) => {
        test(`rejects a request with ${description}`, async() => {
            const result = await handleRelatedSearchesRequest(
                "POST",
                body,
                dependencies([]),
            )

            assert.strictEqual(result.status, 400)
            assert.deepStrictEqual(fetchedQs, [])
        })
    })
})
