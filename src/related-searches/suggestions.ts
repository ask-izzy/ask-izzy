// Server only: turns ISS4 related searches into "People also searched for"
// suggestions.
// See docs/other-services-panel.md § "Ask Izzy's related searches endpoint"

import categories from "@/src/constants/categories"
import Category from "@/src/constants/Category"
import {getAnswerToSave, isNoAnswer} from "@/src/utils/flow-answers"
import type {FlowAnswers} from "@/src/utils/flow-answers"
import {normaliseIss3Q} from "@/src/related-searches/flows"
import type {RelatedSearchFlows} from "@/src/related-searches/flows"
import type {OtherServicesSuggestion} from "@/types/other-services-suggestion"

// No brackets or "-" exclusions (syntax the app adds), so probably typed by a
// person
function isPlainSearch(q: string): boolean {
    return !/[()]|(^|\s)-/.test(q)
}

// The answer to the category's subcategory question, or the category name if
// there isn't one
function getBaseLabel(category: Category, answers: FlowAnswers): string {
    const subcategoryAnswer = answers[`${category.key}-subcategory`]
    const answer = subcategoryAnswer && getAnswerToSave(subcategoryAnswer)
    if (!answer || isNoAnswer(answer)) {
        return category.name
    }
    return Array.isArray(answer) ? answer.join(", ") : answer
}

/*
 * Work out where a related search should take the user, or null if it can't
 * be used: the flow's category if it's in the lookup table, otherwise a
 * keyword search if it looks like something a person typed.
 */
export function getOtherServicesSuggestion(
    relatedSearch: string,
    flows: RelatedSearchFlows,
): OtherServicesSuggestion | null {
    const q = normaliseIss3Q(relatedSearch)
    const flow = flows[q]
    if (flow) {
        const category = categories.find(
            category => category.key === flow.category
        )
        if (!category) {
            return null
        }
        return {
            label: getBaseLabel(category, flow.answers),
            target: {
                type: "category",
                categoryKey: category.key,
                answers: flow.answers,
            },
        }
    }
    if (q && isPlainSearch(q)) {
        const searchText = relatedSearch.trim().replace(/\s+/g, " ")
        return {label: searchText, target: {type: "search", searchText}}
    }
    return null
}

/*
 * Turn the related searches for the current search into suggestions,
 * dropping any which can't be used, are the current search or have the same
 * label as an earlier (more relevant) suggestion.
 */
export function getOtherServicesSuggestions(
    relatedSearches: Array<string>,
    currentQ: string,
    flows: RelatedSearchFlows,
): Array<OtherServicesSuggestion> {
    const normalisedCurrentQ = normaliseIss3Q(currentQ)
    const seenLabels = new Set<string>()
    const suggestions: Array<OtherServicesSuggestion> = []
    for (const relatedSearch of relatedSearches) {
        if (normaliseIss3Q(relatedSearch) === normalisedCurrentQ) {
            continue
        }
        const suggestion = getOtherServicesSuggestion(relatedSearch, flows)
        const labelKey = suggestion?.label.toLowerCase()
        if (!suggestion || !labelKey || seenLabels.has(labelKey)) {
            continue
        }
        seenLabels.add(labelKey)
        suggestions.push(suggestion)
    }
    return suggestions
}
