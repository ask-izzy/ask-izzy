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

    test("maps a category's own q value to the category with no answers", (): void => {
        const foodQ = Object.keys(flows).find(q => q.startsWith("meals -("))

        assert(foodQ)
        assert.deepStrictEqual(flows[foodQ], {category: "food", answers: {}})
    })

    test("keeps only the answers which change the q value", (): void => {
        assert.deepStrictEqual(flows.meals, {
            category: "food",
            answers: {"food-subcategory": "Meals"},
        })
    })

    test("skips categories whose query comes from the url", (): void => {
        const categoryKeys = new Set(Object.values(flows).map(flow => flow.category))

        assert(!categoryKeys.has("search"))
        assert(!categoryKeys.has("disability-advocacy-finder"))
    })
})
