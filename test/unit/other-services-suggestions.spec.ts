/* eslint-disable prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";

import {
    getOtherServicesSuggestionTarget,
    getOtherServicesSuggestionPath,
} from "../../src/utils/other-services-suggestions";
import otherServicesSuggestions
    from "../../src/constants/other-services-suggestions";

/** @see docs/other-services-panel.md § "What clicking a suggestion does" */
test.describe("Other services suggestion targets", function() {
    test("a category name goes to that category", (): void => {
        const target = getOtherServicesSuggestionTarget("Housing")

        assert.strictEqual(target.type, "category")
        assert.strictEqual(target.type === "category" && target.category.key, "housing")
        assert.deepStrictEqual(target.type === "category" && target.answers, {})
        assert.strictEqual(getOtherServicesSuggestionPath(target), "/housing")
    })

    test("a subcategory answer goes to its category with that answer", (): void => {
        const target = getOtherServicesSuggestionTarget("Meals")

        assert.strictEqual(target.type === "category" && target.category.key, "food")
        assert.deepStrictEqual(
            target.type === "category" && target.answers,
            {"food-subcategory": "Meals"},
        )
        assert.strictEqual(getOtherServicesSuggestionPath(target), "/food")
    })

    test("matching ignores case and treats & as and", (): void => {
        const target = getOtherServicesSuggestionTarget(
            "Drugs & Alcohol Counselling"
        )

        assert.strictEqual(
            target.type === "category" && target.category.key,
            "support-and-counselling",
        )
        assert.deepStrictEqual(
            target.type === "category" && target.answers,
            {"support-and-counselling-subcategory": "Drugs and alcohol counselling"},
        )
    })

    test("anything else becomes a keyword search", (): void => {
        const target = getOtherServicesSuggestionTarget("Somewhere to sleep")

        assert.deepStrictEqual(target, {
            type: "search",
            searchText: "Somewhere to sleep",
        })
        assert.strictEqual(
            getOtherServicesSuggestionPath(target),
            "/search/Somewhere%20to%20sleep",
        )
    })

    test("categories hidden from the category list aren't matched", (): void => {
        const target = getOtherServicesSuggestionTarget("Search")

        assert.strictEqual(target.type, "search")
    })
})

test.describe("Other services suggestion fixtures", function() {
    test("cover every kind of suggestion target", (): void => {
        const targets = otherServicesSuggestions
            .map(getOtherServicesSuggestionTarget)

        assert(targets.some(target =>
            target.type === "category" && Object.keys(target.answers).length
        ))
        assert(targets.some(target => target.type === "search"))
    })
})
