import categories from "@/src/constants/categories"
import Category from "@/src/constants/Category"
import storage from "@/src/storage"

type Answer = string | Array<string>

// The category and personalisation answers which produce an ISS3 "q" value
export type RelatedSearchFlow = {
    category: string,
    // Keyed by personalisation page name
    answers: {[personalisationPageName: string]: Answer},
}

// Normalised ISS3 "q" values to the flow which produces them
export type RelatedSearchFlows = {[q: string]: RelatedSearchFlow}

/*
 * The lookup table is several hundred KB so it's loaded separately only when
 * a results page needs it rather than being part of the main bundle.
 */
export async function loadRelatedSearchFlows(): Promise<RelatedSearchFlows> {
    const module = await import("@/src/constants/related-search-flows.json")
    return (module.default ?? module) as RelatedSearchFlows
}

export type OtherServicesSuggestionTarget = {
    type: "category",
    category: Category,
    // Personalisation answers implied by the suggestion, keyed by
    // personalisation page name
    answers: {[personalisationPageName: string]: Answer},
} | {
    type: "search",
    searchText: string,
}

export type OtherServicesSuggestion = {
    label: string,
    target: OtherServicesSuggestionTarget,
}

/*
 * Make ISS3 "q" values comparable regardless of case or spacing.
 */
export function normaliseIss3Q(q: string): string {
    return q.toLowerCase().replace(/\s+/g, " ").trim()
}

/*
 * True if the "q" value has none of the syntax the app adds when building a
 * query (eg "-(coordinating bodies)" exclusions or "(food parcels)" phrases),
 * so is most likely something a person typed.
 * See docs/other-services-panel.md § "Turning a related search back into a flow"
 */
function isPlainSearch(q: string): boolean {
    return !/[()]|(^|\s)-/.test(q)
}

function getLabelForFlow(
    category: Category,
    answers: RelatedSearchFlow["answers"],
): string {
    const subcategoryAnswer = answers[`${category.key}-subcategory`]
    if (typeof subcategoryAnswer === "string" &&
        subcategoryAnswer !== "(skipped)"
    ) {
        return subcategoryAnswer
    }
    return category.name
}

/*
 * Work out where a related search should take the user, or null if it can't
 * be used.
 * See docs/other-services-panel.md § "Turning a related search back into a flow"
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
            label: getLabelForFlow(category, flow.answers),
            target: {type: "category", category, answers: flow.answers},
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
 * dropping any which can't be used, are the current search or repeat an
 * earlier suggestion.
 * See docs/other-services-panel.md § "Where suggestions come from"
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

/*
 * The path to send the user to for a suggestion. This deliberately leaves out
 * the location and personalisation pages: the results page works those out
 * from the saved answers when it loads, showing results if every answer is
 * known or the personalisation wizard if more are needed.
 */
export function getOtherServicesSuggestionPath(
    target: OtherServicesSuggestionTarget
): string {
    if (target.type === "category") {
        return `/${target.category.key}`
    }
    return `/search/${encodeURIComponent(target.searchText)}`
}

/*
 * Save the answers which make up the suggestion's flow, replacing any answer
 * the user gave to those pages before.
 * See docs/other-services-panel.md § "What clicking a suggestion does"
 */
export function saveOtherServicesSuggestionAnswers(
    target: OtherServicesSuggestionTarget
): void {
    if (target.type !== "category") {
        return
    }
    for (const [pageName, answer] of Object.entries(target.answers)) {
        if (Array.isArray(answer)) {
            storage.setJSON(pageName, [...answer])
        } else {
            storage.setItem(pageName, answer)
        }
    }
}
