/* eslint-disable prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";

import {
    getOtherServicesSuggestion,
    getOtherServicesSuggestions,
    getOtherServicesSuggestionPath,
    saveOtherServicesSuggestionAnswers,
} from "../../src/utils/other-services-suggestions";
import type {
    RelatedSearchFlows,
} from "../../src/utils/other-services-suggestions";
import otherServicesSuggestions, {
    exampleRelatedSearchFlows,
} from "../../src/constants/other-services-suggestions";
import categories from "../../src/constants/categories";
import storage from "../../src/storage";

const flows: RelatedSearchFlows = {
    ...exampleRelatedSearchFlows,
    "housing -(coordinating bodies) -(respite care)": {
        category: "housing",
        answers: {"sleep-tonight": "Yes"},
    },
    "(crisis accommodation)": {
        category: "housing",
        answers: {
            "sleep-tonight": "Yes",
            "housing-subcategory": "Emergency accommodation",
        },
    },
    "material aid -(coordinating bodies)": {
        category: "everyday-needs",
        answers: {},
    },
}

/** @see docs/other-services-panel.md § "Turning a related search back into a flow" */
test.describe("Turning a related search into a suggestion", function() {
    test("a known flow with a subcategory answer is labelled with that answer", (): void => {
        const suggestion = getOtherServicesSuggestion("meals", flows)

        assert.strictEqual(suggestion?.label, "Meals")
        const target = suggestion?.target
        assert.strictEqual(target?.type === "category" && target.category.key, "food")
        assert.deepStrictEqual(
            target?.type === "category" && target.answers,
            {"food-subcategory": "Meals"},
        )
        assert.strictEqual(target && getOtherServicesSuggestionPath(target), "/food")
    })

    test("a known flow without a subcategory answer is labelled with the category name", (): void => {
        const housing = getOtherServicesSuggestion(
            "housing -(coordinating bodies) -(respite care)",
            flows,
        )
        const everydayNeeds = getOtherServicesSuggestion(
            "material aid -(coordinating bodies)",
            flows,
        )

        assert.strictEqual(housing?.label, "Housing")
        assert.strictEqual(
            everydayNeeds?.label,
            categories.find(category => category.key === "everyday-needs")?.name,
        )
    })

    test("lookups ignore case and extra whitespace", (): void => {
        const suggestion = getOtherServicesSuggestion(
            "  -(Coordinating Bodies)   (mental health) ",
            flows,
        )

        assert.strictEqual(suggestion?.label, "Mental and emotional health")
    })

    test("an unknown plain search becomes a keyword search", (): void => {
        const suggestion = getOtherServicesSuggestion(" emergency  relief ", flows)

        assert.deepStrictEqual(suggestion, {
            label: "emergency relief",
            target: {type: "search", searchText: "emergency relief"},
        })
        assert.strictEqual(
            suggestion && getOtherServicesSuggestionPath(suggestion.target),
            "/search/emergency%20relief",
        )
    })

    test("an unknown search with query syntax is dropped", (): void => {
        assert.strictEqual(
            getOtherServicesSuggestion("(old phrase) things", flows),
            null,
        )
        assert.strictEqual(
            getOtherServicesSuggestion("things -(coordinating bodies)", flows),
            null,
        )
        assert.strictEqual(getOtherServicesSuggestion("things -excluded", flows), null)
    })

    test("a hyphenated word still counts as plain", (): void => {
        assert.strictEqual(
            getOtherServicesSuggestion("low-interest loans", flows)?.target.type,
            "search",
        )
    })
})

/** @see docs/other-services-panel.md § "Turning a related search back into a flow" */
test.describe("Turning related searches into suggestions", function() {
    test("keeps the endpoint's order and drops unusable searches", (): void => {
        const suggestions = getOtherServicesSuggestions(
            ["(food vouchers)", "(old phrase) things", "relief", "meals"],
            "",
            flows,
        )

        assert.deepStrictEqual(
            suggestions.map(suggestion => suggestion.label),
            ["Food vouchers", "relief", "Meals"],
        )
    })

    test("drops the current search", (): void => {
        const suggestions = getOtherServicesSuggestions(
            ["meals", "(food vouchers)"],
            " MEALS ",
            flows,
        )

        assert.deepStrictEqual(
            suggestions.map(suggestion => suggestion.label),
            ["Food vouchers"],
        )
    })

    test("keeps only the first suggestion with a given label", (): void => {
        const suggestions = getOtherServicesSuggestions(
            [
                "housing -(coordinating bodies) -(respite care)",
                "-(coordinating bodies) -(holiday accommodation) (crisis accommodation)",
                "Housing",
            ],
            "",
            flows,
        )

        assert.strictEqual(suggestions.length, 1)
        assert.deepStrictEqual(
            suggestions[0].target.type === "category" && suggestions[0].target.answers,
            {"sleep-tonight": "Yes"},
        )
    })

    test("returns nothing when there are no related searches", (): void => {
        assert.deepStrictEqual(getOtherServicesSuggestions([], "meals", flows), [])
    })
})

/** @see docs/other-services-panel.md § "What clicking a suggestion does" */
test.describe("Saving a suggestion's answers", function() {
    test.afterEach(() => storage.clear())

    test("saves every answer in the flow, replacing earlier answers", (): void => {
        storage.setItem("housing-subcategory", "Affordable housing")
        storage.setItem("age", "27 to 39")
        const suggestion = getOtherServicesSuggestion("(crisis accommodation)", flows)

        assert(suggestion)
        saveOtherServicesSuggestionAnswers(suggestion.target)

        assert.strictEqual(storage.getItem("sleep-tonight"), "Yes")
        assert.strictEqual(
            storage.getItem("housing-subcategory"),
            "Emergency accommodation",
        )
        // Answers to pages outside the flow are kept
        assert.strictEqual(storage.getItem("age"), "27 to 39")
    })

    test("saves multiple choice answers as a list", (): void => {
        saveOtherServicesSuggestionAnswers({
            type: "category",
            category: categories.find(category => category.key === "housing")!,
            answers: {demographics: ["Couples", "Veteran"]},
        })

        assert.deepStrictEqual(
            storage.getJSON("demographics"),
            ["Couples", "Veteran"],
        )
    })

    test("a keyword search saves nothing", (): void => {
        saveOtherServicesSuggestionAnswers({type: "search", searchText: "meals"})

        assert.strictEqual(storage.getItem("food-subcategory") ?? null, null)
    })
})

test.describe("Example other services suggestions", function() {
    test("cover every kind of suggestion target", (): void => {
        const targets = otherServicesSuggestions.map(suggestion => suggestion.target)

        assert(targets.some(target =>
            target.type === "category" && Object.keys(target.answers).length
        ))
        assert(targets.some(target => target.type === "search"))
    })
})
