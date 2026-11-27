/*
 * Example suggestions for the "People also searched for" panel, used by
 * storybook. On the results page the suggestions come from
 * POST /api/search/related instead.
 * See docs/other-services-panel.md § "Where suggestions come from"
 */
import type {OtherServicesSuggestion} from "@/types/other-services-suggestion"

const otherServicesSuggestions: Array<OtherServicesSuggestion> = [
    {
        label: "Meals",
        target: {
            type: "category",
            categoryKey: "food",
            answers: {"food-subcategory": "Meals"},
        },
    },
    {
        label: "Food vouchers",
        target: {
            type: "category",
            categoryKey: "food",
            answers: {"food-subcategory": "Food vouchers"},
        },
    },
    {
        label: "Mental and emotional health",
        target: {
            type: "category",
            categoryKey: "support-and-counselling",
            answers: {
                "support-and-counselling-subcategory": "Mental and emotional health",
                "demographics-atsi-cald-lgbtiqa": [],
            },
        },
    },
    {
        label: "Housing",
        target: {
            type: "category",
            categoryKey: "housing",
            answers: {
                "sleep-tonight": "No",
                "age": {
                    oneOf: ["(skipped)", "18 to 26", "27 to 39", "40 to 54", "55 to 64"],
                },
                "demographics": [],
            },
        },
    },
    {
        label: "relief",
        target: {type: "search", searchText: "relief"},
    },
]

export default otherServicesSuggestions
