/* eslint-disable prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";

import {
    getCurrentAnswers,
    getOtherServicesSuggestionPath,
    quoteSearchText,
    saveOtherServicesSuggestionAnswers,
} from "../../src/utils/other-services-suggestions";
import otherServicesSuggestions from "../../src/constants/other-services-suggestions";
import storage from "../../src/storage";

/** @see docs/other-services-panel.md § "What clicking a suggestion does" */
test.describe("Where a suggestion goes", function() {
    test("a category suggestion goes to the bare category path", (): void => {
        assert.strictEqual(
            getOtherServicesSuggestionPath({
                type: "category",
                categoryKey: "food",
                answers: {"food-subcategory": "Meals"},
            }),
            "/food",
        )
    })

    test("a keyword search goes to the search path", (): void => {
        assert.strictEqual(
            getOtherServicesSuggestionPath({type: "search", searchText: "emergency relief"}),
            "/search/emergency%20relief",
        )
    })
})

/** @see docs/other-services-panel.md § "What clicking a suggestion does" */
test.describe("Saving a suggestion's answers", function() {
    test.afterEach(() => storage.clear())

    test("saves every answer in the flow, replacing earlier answers", (): void => {
        storage.setItem("housing-subcategory", "Affordable housing")
        storage.setItem("age", "27 to 39")
        saveOtherServicesSuggestionAnswers({
            type: "category",
            categoryKey: "housing",
            answers: {
                "sleep-tonight": "Yes",
                "housing-subcategory": "Emergency accommodation",
            },
        })

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
            categoryKey: "housing",
            answers: {demographics: ["Couples", "Veteran"]},
        })

        assert.deepStrictEqual(
            storage.getJSON("demographics"),
            ["Couples", "Veteran"],
        )
    })

    test("keeps the user's answer when it's one of the equivalent answers", (): void => {
        storage.setItem("age", "27 to 39")
        saveOtherServicesSuggestionAnswers({
            type: "category",
            categoryKey: "housing",
            answers: {
                "sleep-tonight": "No",
                "age": {oneOf: ["(skipped)", "18 to 26", "27 to 39"]},
            },
        })

        assert.strictEqual(storage.getItem("age"), "27 to 39")
        assert.strictEqual(storage.getItem("sleep-tonight"), "No")
    })

    test("keeps a multiple choice answer whose first two selections match", (): void => {
        storage.setJSON("demographics", ["Veteran", "Couples", "Families"])
        saveOtherServicesSuggestionAnswers({
            type: "category",
            categoryKey: "housing",
            answers: {demographics: ["Couples", "Families"]},
        })

        assert.deepStrictEqual(
            storage.getJSON("demographics"),
            ["Couples", "Families", "Veteran"],
        )
    })

    test("otherwise saves skipped if it's one of the equivalent answers", (): void => {
        storage.setItem("age", "65 or older")
        saveOtherServicesSuggestionAnswers({
            type: "category",
            categoryKey: "housing",
            answers: {age: {oneOf: ["18 to 26", "(skipped)", "27 to 39"]}},
        })

        assert.strictEqual(storage.getItem("age"), "(skipped)")
    })

    test("otherwise saves any of the equivalent answers", (): void => {
        saveOtherServicesSuggestionAnswers({
            type: "category",
            categoryKey: "housing",
            answers: {age: {oneOf: ["18 to 26", "27 to 39"]}},
        })

        assert(["18 to 26", "27 to 39"].includes(storage.getItem("age") as string))
    })

    test("saves a skipped answer", (): void => {
        storage.setItem("food-subcategory", "Meals")
        saveOtherServicesSuggestionAnswers({
            type: "category",
            categoryKey: "food",
            answers: {"food-subcategory": "(skipped)"},
        })

        assert.strictEqual(storage.getItem("food-subcategory"), "(skipped)")
    })

    test("a keyword search saves nothing", (): void => {
        saveOtherServicesSuggestionAnswers({type: "search", searchText: "meals"})

        assert.strictEqual(storage.getItem("food-subcategory") ?? null, null)
    })
})

/** @see docs/other-services-panel.md § "Labelling suggestions" */
test.describe("The current answers sent for labelling", function() {
    test.afterEach(() => storage.clear())

    test("are the saved answers to personalisation questions", (): void => {
        storage.setItem("sleep-tonight", "No")
        storage.setJSON("demographics", ["Veteran", "Couples"])
        storage.setItem("not-a-page", "something")

        const answers = getCurrentAnswers()

        assert.strictEqual(answers["sleep-tonight"], "No")
        assert.deepStrictEqual(answers.demographics, ["Couples", "Veteran"])
        assert(!("not-a-page" in answers))
        assert(!("age" in answers))
    })
})

/** @see docs/other-services-panel.md § "How the panel looks" */
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
