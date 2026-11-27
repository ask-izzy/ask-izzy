/* eslint-disable prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";

import {
    getOtherServicesSuggestion,
    getOtherServicesSuggestions,
} from "../../src/related-searches/suggestions";
import type {RelatedSearchFlows} from "../../src/related-searches/flows";
import categories from "../../src/constants/categories";

const flows: RelatedSearchFlows = {
    "meals": {
        category: "food",
        answers: {"food-subcategory": "Meals"},
    },
    "(food vouchers)": {
        category: "food",
        answers: {"food-subcategory": "Food vouchers"},
    },
    "meals -(coordinating bodies)": {
        category: "food",
        answers: {"food-subcategory": "(skipped)"},
    },
    "-(coordinating bodies) (mental health)": {
        category: "health",
        answers: {"health-subcategory": "Mental and emotional health"},
    },
    "housing -(coordinating bodies) -(respite care)": {
        category: "housing",
        answers: {"sleep-tonight": "Yes"},
    },
    "housing (rental assistance)": {
        category: "housing",
        answers: {"sleep-tonight": "No"},
    },
    "material aid -(coordinating bodies)": {
        category: "everyday-needs",
        answers: {},
    },
    "(crisis accommodation)": {
        category: "housing",
        answers: {
            "sleep-tonight": "Yes",
            "housing-subcategory": {oneOf: ["(skipped)", "Emergency accommodation"]},
        },
    },
}

/** @see docs/other-services-panel.md § "Turning a related search back into a flow" */
test.describe("Turning a related search into a suggestion", function() {
    test("a known flow with a subcategory answer is labelled with that answer", (): void => {
        assert.deepStrictEqual(getOtherServicesSuggestion("meals", flows), {
            label: "Meals",
            target: {
                type: "category",
                categoryKey: "food",
                answers: {"food-subcategory": "Meals"},
            },
        })
    })

    test("a known flow without a subcategory answer is labelled with the category name", (): void => {
        assert.strictEqual(
            getOtherServicesSuggestion("meals -(coordinating bodies)", flows)?.label,
            "Food",
        )
        assert.strictEqual(
            getOtherServicesSuggestion("material aid -(coordinating bodies)", flows)?.label,
            categories.find(category => category.key === "everyday-needs")?.name,
        )
    })

    test("a subcategory answer with options is labelled with the one that would be saved", (): void => {
        // Skipping is saved, so there's no subcategory to label it with
        assert.strictEqual(
            getOtherServicesSuggestion("(crisis accommodation)", flows)?.label,
            "Housing",
        )
    })

    test("lookups ignore case and extra whitespace", (): void => {
        assert.strictEqual(
            getOtherServicesSuggestion(
                "  -(Coordinating Bodies)   (mental health) ",
                flows,
            )?.label,
            "Mental and emotional health",
        )
    })

    test("an unknown plain search becomes a keyword search", (): void => {
        assert.deepStrictEqual(
            getOtherServicesSuggestion(" emergency  relief ", flows),
            {
                label: "emergency relief",
                target: {type: "search", searchText: "emergency relief"},
            },
        )
    })

    test("an unknown search with query syntax is dropped", (): void => {
        assert.strictEqual(getOtherServicesSuggestion("(old phrase) things", flows), null)
        assert.strictEqual(getOtherServicesSuggestion("things -excluded", flows), null)
    })

    test("a hyphenated word still counts as plain", (): void => {
        assert.strictEqual(
            getOtherServicesSuggestion("low-interest loans", flows)?.target.type,
            "search",
        )
    })

    test("a flow for a category which no longer exists is dropped", (): void => {
        assert.strictEqual(
            getOtherServicesSuggestion("gone", {
                gone: {category: "no-such-category", answers: {}},
            }),
            null,
        )
    })
})

/** @see docs/other-services-panel.md § "Where suggestions come from" */
test.describe("Turning related searches into suggestions", function() {
    test("keeps the order of the related searches", (): void => {
        const suggestions = getOtherServicesSuggestions(
            ["(food vouchers)", "relief", "meals"],
            "housing -(coordinating bodies) -(respite care)",
            flows,
        )

        assert.deepStrictEqual(
            suggestions.map(suggestion => suggestion.label),
            ["Food vouchers", "relief", "Meals"],
        )
    })

    test("drops the current search", (): void => {
        const suggestions = getOtherServicesSuggestions(
            ["MEALS", "(food vouchers)"],
            " meals ",
            flows,
        )

        assert.deepStrictEqual(
            suggestions.map(suggestion => suggestion.label),
            ["Food vouchers"],
        )
    })

    test("keeps only the first of suggestions with the same label", (): void => {
        const suggestions = getOtherServicesSuggestions(
            [
                "housing (rental assistance)",
                "housing -(coordinating bodies) -(respite care)",
                "(crisis accommodation)",
            ],
            "meals",
            flows,
        )

        assert.deepStrictEqual(suggestions.map(suggestion => suggestion.label), ["Housing"])
        assert.deepStrictEqual(
            suggestions[0].target.type === "category" && suggestions[0].target.answers,
            {"sleep-tonight": "No"},
        )
    })

    test("drops searches which can't be used", (): void => {
        assert.deepStrictEqual(
            getOtherServicesSuggestions(["(old phrase) things", ""], "meals", flows),
            [],
        )
    })
})
