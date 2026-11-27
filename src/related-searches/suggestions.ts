// Server only: turns ISS4 related searches into "People also searched for"
// suggestions.
// See docs/other-services-panel.md § "Ask Izzy's related searches endpoint"

import categories from "@/src/constants/categories"
import Category from "@/src/constants/Category"
import {getAnswerToSave, isNoAnswer} from "@/src/utils/flow-answers"
import type {FlowAnswers} from "@/src/utils/flow-answers"
import {normaliseIss3Q} from "@/src/related-searches/flows"
import type {RelatedSearchFlows} from "@/src/related-searches/flows"
import {
    getCurrentSearchItem,
    getMinimalLabels,
} from "@/src/related-searches/labels"
import type {LabelItem} from "@/src/related-searches/labels"
import type {
    CurrentAnswers,
    OtherServicesSuggestion,
} from "@/types/other-services-suggestion"

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
 * dropping any which can't be used or are the current search. Category
 * suggestions get the details getMinimalLabels() picks. Any still sharing a
 * label keep only the first (most relevant).
 * See docs/other-services-panel.md § "Labelling suggestions"
 */
export function getOtherServicesSuggestions(
    relatedSearches: Array<string>,
    currentQ: string,
    flows: RelatedSearchFlows,
    currentCategoryKey?: string,
    currentAnswers: CurrentAnswers = {},
): Array<OtherServicesSuggestion> {
    const normalisedCurrentQ = normaliseIss3Q(currentQ)
    const suggestions = relatedSearches
        .filter(relatedSearch =>
            normaliseIss3Q(relatedSearch) !== normalisedCurrentQ
        )
        .map(relatedSearch => getOtherServicesSuggestion(relatedSearch, flows))
        .filter((suggestion): suggestion is OtherServicesSuggestion =>
            Boolean(suggestion?.label)
        )

    // Only category suggestions get details. Keyword searches keep their text.
    const categorySuggestions: Array<{
        suggestion: OtherServicesSuggestion,
        item: LabelItem,
    }> = suggestions.flatMap(suggestion => {
        const {target} = suggestion
        const category = target.type === "category" && categories.find(
            category => category.key === target.categoryKey
        )
        return target.type === "category" && category ?
            [{
                suggestion,
                item: {category, answers: target.answers, base: suggestion.label},
            }]
            : []
    })
    const labels = new Map<OtherServicesSuggestion, string | null>()
    getMinimalLabels(
        categorySuggestions.map(({item}) => item),
        getCurrentSearchItem(
            flows[normalisedCurrentQ]?.answers ?? null,
            currentCategoryKey,
            currentAnswers,
        ),
        currentAnswers,
    ).forEach((label, index) =>
        labels.set(categorySuggestions[index].suggestion, label)
    )
    const labelled = suggestions.flatMap(suggestion => {
        if (!labels.has(suggestion)) {
            return [suggestion]
        }
        const label = labels.get(suggestion)
        // null: can't be told apart from the current search
        return label ? [{...suggestion, label}] : []
    })

    const seenLabels = new Set<string>()
    return labelled.filter(suggestion => {
        const labelKey = suggestion.label.toLowerCase()
        if (seenLabels.has(labelKey)) {
            return false
        }
        seenLabels.add(labelKey)
        return true
    })
}
