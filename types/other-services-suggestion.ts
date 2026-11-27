// The "People also searched for" suggestions as sent from the server
// (POST /api/search/related) to the client, so they must be plain JSON.
// See docs/other-services-panel.md § "Ask Izzy's related searches endpoint"

import type {FlowAnswers} from "@/src/utils/flow-answers"

export type OtherServicesSuggestionTarget = {
    type: "category",
    categoryKey: string,
    // Personalisation answers to save before going to the category
    answers: FlowAnswers,
} | {
    type: "search",
    searchText: string,
}

export type OtherServicesSuggestion = {
    label: string,
    target: OtherServicesSuggestionTarget,
}

export type RelatedSearchesRequest = {
    // The ISS3 "q" value of the current search
    q: string,
}

export type RelatedSearchesResponse = {
    suggestions: Array<OtherServicesSuggestion>,
}
