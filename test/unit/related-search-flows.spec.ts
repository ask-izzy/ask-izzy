/* eslint-disable prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";

import {buildRelatedSearchFlows} from "../../scripts/lib/related-search-flows";
import committedFlows from "../../src/constants/related-search-flows.json";
import type {RelatedSearchFlows} from "../../src/utils/other-services-suggestions";

/** @see docs/other-services-panel.md § "Turning a related search back into a flow" */
test.describe("Related search flows lookup table", function() {
    let flows: RelatedSearchFlows

    test.beforeAll(() => {
        test.setTimeout(120_000)
        flows = buildRelatedSearchFlows()
    })

    test("the committed table matches what the code produces", (): void => {
        assert.deepStrictEqual(
            committedFlows,
            flows,
            "src/constants/related-search-flows.json is out of date. " +
                "Run `yarn generate-related-search-flows` to update it.",
        )
    })

    test("keeps a skipped answer when other answers would change the q value", (): void => {
        // Picking any food subcategory replaces the default food search terms
        const foodQ = Object.keys(flows).find(q => q.startsWith("meals -("))

        assert(foodQ)
        assert.deepStrictEqual(flows[foodQ], {
            category: "food",
            answers: {"food-subcategory": "(skipped)"},
        })
    })

    test("leaves out answers when every answer gives the same q value", (): void => {
        // Who is looking for help doesn't change the food search terms
        assert.deepStrictEqual(flows.meals, {
            category: "food",
            answers: {"food-subcategory": "Meals"},
        })
    })

    test("lists every answer which gives the same q value, skipping first", (): void => {
        const flow = flows["(crisis accommodation)"]

        assert.strictEqual(flow.category, "housing")
        assert.strictEqual(flow.answers["housing-subcategory"], "Emergency accommodation")
        // Only the youngest and oldest ages add search terms
        assert.deepStrictEqual(flow.answers.age, {
            oneOf: ["(skipped)", "18 to 26", "27 to 39", "40 to 54", "55 to 64"],
        })
    })

    test("never leaves out an answer which shows or hides another question", (): void => {
        // Not needing somewhere to sleep tonight hides the housing
        // subcategory question
        const flow = flows[
            "-(coordinating bodies) -(holiday accommodation) (crisis accommodation)"
        ]

        assert.strictEqual(flow.answers["sleep-tonight"], "No")
    })

    test("skips categories whose query comes from the url", (): void => {
        const categoryKeys = new Set(Object.values(flows).map(flow => flow.category))

        assert(!categoryKeys.has("search"))
        assert(!categoryKeys.has("disability-advocacy-finder"))
    })
})
