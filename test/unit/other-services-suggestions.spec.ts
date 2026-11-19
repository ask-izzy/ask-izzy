/* eslint-disable prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";

import {
    getOtherServicesSuggestion,
    getOtherServicesSuggestions,
    getOtherServicesSuggestionPath,
    quoteSearchText,
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

    test("tells apart suggestions with the same label by the fewest answers", (): void => {
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
            ["Housing for people safe tonight", "Housing for people not safe tonight"],
        )
    })

    test("doesn't mention an answer the user already has", (): void => {
        storage.setItem("sleep-tonight", "No")
        const suggestions = getOtherServicesSuggestions(
            ["housing (rental assistance)", "housing -(coordinating bodies) -(respite care)"],
            "",
            flows,
            "food",
        )

        assert.deepStrictEqual(
            suggestions.map(suggestion => suggestion.label),
            ["Housing", "Housing for people safe tonight"],
        )
        storage.clear()
    })

    test("adds the category when the same subcategory answer is in another category", (): void => {
        storage.setItem("housing-subcategory", "Homelessness support")
        const suggestions = getOtherServicesSuggestions(
            ["(homelessness counselling)", "meals"],
            "(homelessness)",
            {
                ...flows,
                "(homelessness)": {
                    category: "housing",
                    answers: {"housing-subcategory": "Homelessness support"},
                },
                "(homelessness counselling)": {
                    category: "support-and-counselling",
                    answers: {
                        "support-and-counselling-subcategory": "Homelessness support",
                    },
                },
            },
            "housing",
        )

        assert.deepStrictEqual(
            suggestions.map(suggestion => suggestion.label),
            ["Support and counselling › Homelessness support", "Meals"],
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
test.describe("Telling a suggestion apart from the current search", function() {
    test.afterEach(() => storage.clear())

    function getLabels(
        relatedSearches: Array<string>,
        currentQ: string,
        currentCategoryKey: string,
    ): Array<string> {
        return getOtherServicesSuggestions(
            relatedSearches,
            currentQ,
            flows,
            currentCategoryKey,
        ).map(suggestion => suggestion.label)
    }

    test("needs nothing more when the subcategory answer differs", (): void => {
        storage.setItem("food-subcategory", "Meals")

        assert.deepStrictEqual(
            getLabels(["meals -(coordinating bodies)", "(food vouchers)"], "meals", "food"),
            ["Food", "Food vouchers"],
        )
    })

    test("adds the fewest answers it would change", (): void => {
        storage.setItem("sleep-tonight", "Yes")
        storage.setItem("housing-subcategory", "Emergency accommodation")
        storage.setItem("age", "18 to 26")
        storage.setJSON("demographics", ["Couples"])

        // Age is enough so removing couples isn't mentioned
        assert.deepStrictEqual(
            getLabels(["(crisis accommodation) youth"], "(crisis accommodation)", "housing"),
            ["Emergency accommodation for under 18s"],
        )
    })

    test("says which answer it would remove, and only one if that's enough", (): void => {
        storage.setItem("sleep-tonight", "Yes")
        storage.setItem("housing-subcategory", "Emergency accommodation")
        storage.setItem("age", "0 to 17")
        storage.setJSON("demographics", ["Aboriginal and/or Torres Strait Islander", "Couples"])

        // Couples would be removed too but isn't needed to tell it apart
        assert.deepStrictEqual(
            getLabels(["(crisis accommodation) youth"], "(crisis accommodation)", "housing"),
            ["Emergency accommodation not just for Aboriginal and Torres Strait Islander people"],
        )
    })

    test("lists several answers when one isn't enough", (): void => {
        storage.setItem("sleep-tonight", "Yes")
        storage.setItem("housing-subcategory", "Emergency accommodation")
        const crisis = {
            "sleep-tonight": "Yes",
            "housing-subcategory": "Emergency accommodation",
        }

        assert.deepStrictEqual(
            getOtherServicesSuggestions(
                ["(couples veterans)", "(couples)", "(veterans)"],
                "(crisis accommodation)",
                {
                    ...flows,
                    "(couples veterans)": {
                        category: "housing",
                        answers: {...crisis, demographics: ["Couples", "Veteran"]},
                    },
                    "(couples)": {
                        category: "housing",
                        answers: {...crisis, demographics: ["Couples"]},
                    },
                    "(veterans)": {
                        category: "housing",
                        answers: {...crisis, demographics: ["Veteran"]},
                    },
                },
                "housing",
            ).map(suggestion => suggestion.label),
            [
                "Emergency accommodation for couples and veterans",
                "Emergency accommodation for couples",
                "Emergency accommodation for veterans",
            ],
        )
    })

    test("uses the page's wording for answers which need the question", (): void => {
        storage.setItem("sleep-tonight", "Yes")

        assert.deepStrictEqual(
            getLabels(["housing (rental assistance)"], "housing -(coordinating bodies) -(respite care)", "housing"),
            ["Housing for people not safe tonight"],
        )
    })

    test("is dropped when it can't be told apart from the current search", (): void => {
        storage.setItem("sleep-tonight", "Yes")
        storage.setItem("housing-subcategory", "Emergency accommodation")

        assert.deepStrictEqual(
            getLabels(["(crisis accommodation)", "meals"], "(emergency housing)", "housing"),
            ["Meals"],
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

/** @see docs/other-services-panel.md § "Turning a related search back into a flow" */
test.describe("Showing a keyword search", function() {
    test("is in quotes", (): void => {
        assert.strictEqual(quoteSearchText("emergency relief"), "“emergency relief”")
    })

    test("isn't quoted again if it's already in quotes", (): void => {
        assert.strictEqual(quoteSearchText("\"food bank\""), "\"food bank\"")
        assert.strictEqual(quoteSearchText("“food bank”"), "“food bank”")
    })

    test("is quoted if it only has a quote at one end", (): void => {
        assert.strictEqual(quoteSearchText("\"food bank"), "“\"food bank”")
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
