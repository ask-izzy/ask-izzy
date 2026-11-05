/*
 * Example suggestions for the "People also searched for" panel, used by
 * storybook and tests. On the results page the suggestions come from ISS4's
 * related searches endpoint instead.
 * See docs/other-services-panel.md § "Where suggestions come from"
 */
import {getOtherServicesSuggestions} from "@/src/utils/other-services-suggestions"
import type {
    OtherServicesSuggestion,
    RelatedSearchFlows,
} from "@/src/utils/other-services-suggestions"

// A subset of src/constants/related-search-flows.json
export const exampleRelatedSearchFlows: RelatedSearchFlows = {
    "meals": {
        category: "food",
        answers: {"food-subcategory": "Meals"},
    },
    "(food vouchers)": {
        category: "food",
        answers: {"food-subcategory": "Food vouchers"},
    },
    "-(coordinating bodies) (mental health)": {
        category: "support-and-counselling",
        answers: {
            "support-and-counselling-subcategory": "Mental and emotional health",
            "demographics-atsi-cald-lgbtiqa": [],
        },
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
}

// Related searches as returned by ISS4 (raw ISS3 "q" values)
export const exampleRelatedSearches: Array<string> = [
    "meals",
    "(food vouchers)",
    "-(coordinating bodies) (mental health)",
    "-(coordinating bodies) -(holiday accommodation) (crisis accommodation)",
    "relief",
]

const otherServicesSuggestions: Array<OtherServicesSuggestion> =
    getOtherServicesSuggestions(
        exampleRelatedSearches,
        "",
        exampleRelatedSearchFlows,
    )

export default otherServicesSuggestions
