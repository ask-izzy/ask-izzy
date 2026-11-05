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
    "meals -(coordinating bodies)": {
        category: "food",
        answers: {"food-subcategory": "(skipped)"},
    },
    "(crisis accommodation) youth": {
        category: "housing",
        answers: {
            "sleep-tonight": {oneOf: ["(skipped)", "Yes"]},
            "housing-subcategory": "Emergency accommodation",
            "age": "0 to 17",
            "demographics": [],
        },
    },
    "housing (rental assistance)": {
        category: "housing",
        answers: {
            "sleep-tonight": "No",
            "age": {oneOf: ["(skipped)", "18 to 26", "27 to 39"]},
        },
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

    test("tells apart suggestions for another category which would have the same label", (): void => {
        const suggestions = getOtherServicesSuggestions(
            [
                "housing -(coordinating bodies) -(respite care)",
                "-(coordinating bodies) -(holiday accommodation) (crisis accommodation)",
            ],
            "",
            flows,
            "food",
        )

        // Only sleep tonight is needed to tell them apart, not age or
        // demographics which also differ
        assert.deepStrictEqual(
            suggestions.map(suggestion => suggestion.label),
            ["Housing: yes", "Housing: no"],
        )
    })

    test("uses the user's answers when telling suggestions apart", (): void => {
        storage.setItem("sleep-tonight", "No")
        const suggestions = getOtherServicesSuggestions(
            ["housing (rental assistance)", "housing -(coordinating bodies) -(respite care)"],
            "",
            flows,
            "food",
        )

        assert.deepStrictEqual(
            suggestions.map(suggestion => suggestion.label),
            ["Housing: no", "Housing: yes"],
        )
        storage.clear()
    })

    test("keeps only the first of suggestions which can't be told apart", (): void => {
        storage.setItem("age", "27 to 39")
        const suggestions = getOtherServicesSuggestions(
            ["(rental help)", "(rental assistance)"],
            "",
            {
                "(rental help)": {
                    category: "housing",
                    answers: {"age": {oneOf: ["(skipped)", "27 to 39"]}},
                },
                "(rental assistance)": {
                    category: "housing",
                    answers: {"age": "27 to 39"},
                },
            },
            "food",
        )

        assert.strictEqual(suggestions.length, 1)
        assert.strictEqual(suggestions[0].label, "Housing")
        storage.clear()
    })

    test("returns nothing when there are no related searches", (): void => {
        assert.deepStrictEqual(getOtherServicesSuggestions([], "meals", flows), [])
    })
})

/** @see docs/other-services-panel.md § "Turning a related search back into a flow" */
test.describe("Labelling a suggestion for the category the user is in", function() {
    test.afterEach(() => storage.clear())

    function getLabel(relatedSearch: string, currentCategoryKey: string): string | undefined {
        return getOtherServicesSuggestion(relatedSearch, flows, currentCategoryKey)?.label
    }

    test("says which answer it would remove", (): void => {
        storage.setItem("food-subcategory", "Meals")

        assert.strictEqual(getLabel("meals -(coordinating bodies)", "food"), "Food without meals")
        // Suggestions for other categories aren't affected
        assert.strictEqual(getLabel("meals -(coordinating bodies)", "housing"), "Food")
    })

    test("is labelled with a new subcategory answer", (): void => {
        storage.setItem("food-subcategory", "Meals")

        assert.strictEqual(getLabel("(food vouchers)", "food"), "Food vouchers")
    })

    test("lists other answers it would change", (): void => {
        storage.setItem("sleep-tonight", "Yes")
        storage.setItem("housing-subcategory", "Emergency accommodation")
        storage.setItem("age", "27 to 39")

        // The subcategory question isn't asked when sleep tonight is "No"
        // so the saved subcategory isn't mentioned
        assert.strictEqual(getLabel("housing (rental assistance)", "housing"), "Housing: no")
    })

    test("lowercases added answers unless they start with an acronym or proper noun", (): void => {
        storage.setJSON("demographics", ["Aboriginal and/or Torres Strait Islander", "LGBTIQA+"])
        storage.setItem("sleep-tonight", "Yes")

        assert.strictEqual(
            getLabel("housing (rental assistance)", "housing"),
            "Housing: no",
        )
        assert.strictEqual(
            getLabel("(crisis accommodation) youth", "housing"),
            "Emergency accommodation: 0 to 17 without " +
                "Aboriginal and/or Torres Strait Islander, LGBTIQA+",
        )
    })

    test("leaves out answers the user already gave", (): void => {
        storage.setItem("sleep-tonight", "Yes")
        storage.setItem("housing-subcategory", "Affordable housing")
        storage.setItem("age", "18 to 26")
        storage.setJSON("demographics", ["Couples"])

        assert.strictEqual(
            getLabel("(crisis accommodation) youth", "housing"),
            "Emergency accommodation: 0 to 17 without couples",
        )
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

    test("keeps the user's answer when it's one of the equivalent answers", (): void => {
        storage.setItem("age", "27 to 39")
        const suggestion = getOtherServicesSuggestion("housing (rental assistance)", flows)

        assert(suggestion)
        saveOtherServicesSuggestionAnswers(suggestion.target)

        assert.strictEqual(storage.getItem("age"), "27 to 39")
        assert.strictEqual(storage.getItem("sleep-tonight"), "No")
    })

    test("otherwise saves skipped if it's one of the equivalent answers", (): void => {
        storage.setItem("age", "65 or older")
        saveOtherServicesSuggestionAnswers({
            type: "category",
            category: categories.find(category => category.key === "housing")!,
            answers: {age: {oneOf: ["18 to 26", "(skipped)", "27 to 39"]}},
        })

        assert.strictEqual(storage.getItem("age"), "(skipped)")
    })

    test("otherwise saves any of the equivalent answers", (): void => {
        saveOtherServicesSuggestionAnswers({
            type: "category",
            category: categories.find(category => category.key === "housing")!,
            answers: {age: {oneOf: ["18 to 26", "27 to 39"]}},
        })

        assert(["18 to 26", "27 to 39"].includes(storage.getItem("age") as string))
    })

    test("saves skipped when the user hasn't given an equivalent answer", (): void => {
        storage.setItem("age", "65 or older")
        const suggestion = getOtherServicesSuggestion("housing (rental assistance)", flows)

        assert(suggestion)
        saveOtherServicesSuggestionAnswers(suggestion.target)

        assert.strictEqual(storage.getItem("age"), "(skipped)")
    })

    test("saves a skipped answer", (): void => {
        storage.setItem("food-subcategory", "Meals")
        const suggestion = getOtherServicesSuggestion("meals -(coordinating bodies)", flows)

        assert(suggestion)
        saveOtherServicesSuggestionAnswers(suggestion.target)

        assert.strictEqual(storage.getItem("food-subcategory"), "(skipped)")
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
