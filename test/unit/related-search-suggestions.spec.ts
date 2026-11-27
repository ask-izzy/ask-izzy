/* eslint-disable prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";

import {
    getOtherServicesSuggestion,
    getOtherServicesSuggestions,
} from "../../src/related-searches/suggestions";
import type {RelatedSearchFlows} from "../../src/related-searches/flows";
import type {CurrentAnswers} from "../../src/related-searches/labels";
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

    test("keeps only the first of suggestions which would do the same thing", (): void => {
        // The last two both save sleep tonight "Yes" and skip the subcategory
        const suggestions = getOtherServicesSuggestions(
            [
                "housing (rental assistance)",
                "housing -(coordinating bodies) -(respite care)",
                "(crisis accommodation)",
            ],
            "meals",
            flows,
        )

        assert.deepStrictEqual(
            suggestions.map(suggestion => suggestion.label),
            ["Housing for people not safe tonight", "Housing for people safe tonight"],
        )
        assert.deepStrictEqual(
            suggestions[1].target.type === "category" && suggestions[1].target.answers,
            {"sleep-tonight": "Yes"},
        )
    })

    test("drops searches which can't be used", (): void => {
        assert.deepStrictEqual(
            getOtherServicesSuggestions(["(old phrase) things", ""], "meals", flows),
            [],
        )
    })
})

// Flows for the label tests, a subset of the generated lookup table plus some
// made up ones
const labelFlows: RelatedSearchFlows = {
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
    "housing -(coordinating bodies) -(respite care)": {
        category: "housing",
        answers: {"sleep-tonight": "Yes"},
    },
    "-(coordinating bodies) -(holiday accommodation) (crisis accommodation)": {
        category: "housing",
        answers: {
            "sleep-tonight": "No",
            "age": {
                oneOf: ["(skipped)", "18 to 26", "27 to 39", "40 to 54", "55 to 64"],
            },
            "demographics": [],
        },
    },
    "(crisis accommodation)": {
        category: "housing",
        answers: {
            "sleep-tonight": "Yes",
            "housing-subcategory": "Emergency accommodation",
        },
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

function getLabels(
    relatedSearches: Array<string>,
    currentQ: string,
    currentCategoryKey: string,
    currentAnswers: CurrentAnswers = {},
    flows: RelatedSearchFlows = labelFlows,
): Array<string> {
    return getOtherServicesSuggestions(
        relatedSearches,
        currentQ,
        flows,
        currentCategoryKey,
        currentAnswers,
    ).map(suggestion => suggestion.label)
}

/** @see docs/other-services-panel.md § "Labelling suggestions" */
test.describe("Telling suggestions apart from each other", function() {
    test("adds the fewest answers needed", (): void => {
        // Only sleep tonight is needed to tell them apart, not age or
        // demographics which also differ
        assert.deepStrictEqual(
            getLabels(
                [
                    "housing -(coordinating bodies) -(respite care)",
                    "-(coordinating bodies) -(holiday accommodation) (crisis accommodation)",
                ],
                "meals",
                "food",
            ),
            ["Housing for people safe tonight", "Housing for people not safe tonight"],
        )
    })

    test("doesn't mention an answer the user already has", (): void => {
        assert.deepStrictEqual(
            getLabels(
                ["housing (rental assistance)", "housing -(coordinating bodies) -(respite care)"],
                "meals",
                "food",
                {"sleep-tonight": "No"},
            ),
            ["Housing", "Housing for people safe tonight"],
        )
    })

    test("adds the category when the same subcategory answer is in another category", (): void => {
        assert.deepStrictEqual(
            getLabels(
                ["(homelessness counselling)", "meals"],
                "(homelessness)",
                "housing",
                {"housing-subcategory": "Homelessness support"},
                {
                    ...labelFlows,
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
            ),
            ["Support and counselling › Homelessness support", "Meals"],
        )
    })

    test("keeps only the first of suggestions which can't be told apart", (): void => {
        assert.deepStrictEqual(
            getLabels(
                ["(rental help)", "(rental assistance)"],
                "meals",
                "food",
                {"age": "27 to 39"},
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
            ),
            ["Housing"],
        )
    })

    test("leaves keyword searches as they are", (): void => {
        assert.deepStrictEqual(
            getLabels(["relief", "meals"], "(food vouchers)", "food"),
            ["relief", "Meals"],
        )
    })
})

/** @see docs/other-services-panel.md § "Labelling suggestions" */
test.describe("Telling a suggestion apart from the current search", function() {
    test("needs nothing more when the subcategory answer differs", (): void => {
        assert.deepStrictEqual(
            getLabels(
                ["meals -(coordinating bodies)", "(food vouchers)"],
                "meals",
                "food",
                {"food-subcategory": "Meals"},
            ),
            ["Food", "Food vouchers"],
        )
    })

    test("adds the fewest answers it would change", (): void => {
        // Age is enough so removing couples isn't mentioned
        assert.deepStrictEqual(
            getLabels(
                ["(crisis accommodation) youth"],
                "(crisis accommodation)",
                "housing",
                {
                    "sleep-tonight": "Yes",
                    "housing-subcategory": "Emergency accommodation",
                    "age": "18 to 26",
                    "demographics": ["Couples"],
                },
            ),
            ["Emergency accommodation for under 18s"],
        )
    })

    test("says which answer it would remove, and only one if that's enough", (): void => {
        // Couples would be removed too but isn't needed to tell it apart
        assert.deepStrictEqual(
            getLabels(
                ["(crisis accommodation) youth"],
                "(crisis accommodation)",
                "housing",
                {
                    "sleep-tonight": "Yes",
                    "housing-subcategory": "Emergency accommodation",
                    "age": "0 to 17",
                    "demographics": ["Aboriginal and/or Torres Strait Islander", "Couples"],
                },
            ),
            ["Emergency accommodation not just for Aboriginal and Torres Strait Islander people"],
        )
    })

    test("lists several answers when one isn't enough", (): void => {
        const crisis = {
            "sleep-tonight": "Yes",
            "housing-subcategory": "Emergency accommodation",
        }

        assert.deepStrictEqual(
            getLabels(
                ["(couples veterans)", "(couples)", "(veterans)"],
                "(crisis accommodation)",
                "housing",
                crisis,
                {
                    ...labelFlows,
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
            ),
            [
                "Emergency accommodation for couples and veterans",
                "Emergency accommodation for couples",
                "Emergency accommodation for veterans",
            ],
        )
    })

    test("uses the page's wording for answers which need the question", (): void => {
        assert.deepStrictEqual(
            getLabels(
                ["housing (rental assistance)"],
                "housing -(coordinating bodies) -(respite care)",
                "housing",
                {"sleep-tonight": "Yes"},
            ),
            ["Housing for people not safe tonight"],
        )
    })

    test("is dropped when it can't be told apart from the current search", (): void => {
        assert.deepStrictEqual(
            getLabels(
                ["(crisis accommodation)", "meals"],
                "(emergency housing)",
                "housing",
                {
                    "sleep-tonight": "Yes",
                    "housing-subcategory": "Emergency accommodation",
                },
            ),
            ["Meals"],
        )
    })

    test("is labelled against the current search's flow rather than a saved answer it doesn't use", (): void => {
        // Not being safe tonight means the housing subcategory isn't asked,
        // so the current search is just "Housing" despite the saved answer
        assert.deepStrictEqual(
            getLabels(
                ["(crisis accommodation)"],
                "-(coordinating bodies) -(holiday accommodation) (crisis accommodation)",
                "housing",
                {
                    "sleep-tonight": "No",
                    "housing-subcategory": "Emergency accommodation",
                },
            ),
            ["Emergency accommodation"],
        )
    })
})
