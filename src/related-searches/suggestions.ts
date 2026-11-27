// Server only: turns ISS4 related searches into "People also searched for"
// suggestions.
// See docs/other-services-panel.md § "Turning a related search back into a flow"

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
import type {CurrentAnswers, LabelItem} from "@/src/related-searches/labels"
import type {OtherServicesSuggestion} from "@/types/other-services-suggestion"

/*
 * True if the "q" value has none of the syntax the app adds when building a
 * query (eg "-(coordinating bodies)" exclusions or "(food parcels)" phrases),
 * so is most likely something a person typed.
 */
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
 * dropping any which can't be used or are the current search. Each label
 * has just enough detail to tell it apart from the other suggestions and
 * from the current search, relative to the user's current answers. If
 * suggestions still share a label, only the first (most relevant) is kept.
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
    const labels = getMinimalLabels(
        categorySuggestions.map(({item}) => item),
        getCurrentSearchItem(
            flows[normalisedCurrentQ]?.answers ?? null,
            currentCategoryKey,
            currentAnswers,
        ),
        currentAnswers,
    )
    const labelled = suggestions.flatMap(suggestion => {
        const index = categorySuggestions
            .findIndex(categorySuggestion =>
                categorySuggestion.suggestion === suggestion
            )
        if (index === -1) {
            return [suggestion]
        }
        const label = labels[index]
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
