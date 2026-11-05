import categories from "@/src/constants/categories"
import Category from "@/src/constants/Category"
import storage from "@/src/storage"

type Answer = string | Array<string>

// Any of these answers produce the same "q" value. The first is saved unless
// the user has already given one of them.
export type AnswerOptions = {oneOf: Array<Answer>}

export type FlowAnswers = {[personalisationPageName: string]: Answer | AnswerOptions}

// The category and personalisation answers which produce an ISS3 "q" value
export type RelatedSearchFlow = {
    category: string,
    // Keyed by personalisation page name
    answers: FlowAnswers,
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
    answers: FlowAnswers,
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

function isAnswerOptions(
    answer: Answer | AnswerOptions | undefined
): answer is AnswerOptions {
    return Boolean(answer) && typeof answer === "object" && "oneOf" in answer
}

// The answer saved for anyone who hasn't already given one of the flow's
// answers: skipping (or selecting nothing) if that's an option, otherwise any
// of them since they all give the same search.
// See docs/other-services-panel.md § "What clicking a suggestion does"
function getAnswerToSave(answer: Answer | AnswerOptions): Answer {
    if (!isAnswerOptions(answer)) {
        return answer
    }
    return answer.oneOf.find(option => isNoAnswer(option)) ?? answer.oneOf[0]
}

function isNoAnswer(answer: Answer | null | undefined): boolean {
    return !answer || answer === "(skipped)" ||
        (Array.isArray(answer) && answer.length === 0)
}

function describeAnswer(answer: Answer): string {
    return Array.isArray(answer) ? answer.join(", ") : answer
}

// First words of answers which are proper nouns so stay capitalised
const PROPER_NOUNS = ["Aboriginal", "Centrelink", "I", "I'm"]

/*
 * Answers are in sentence case so when one is added part way through a label
 * its first word is lowercased, unless it's an acronym (eg "LGBTIQA+") or a
 * proper noun. Any other capitals in an answer are intentional.
 * See docs/other-services-panel.md § "Turning a related search back into a flow"
 */
function lowercaseFirstWord(text: string): string {
    const firstWord = text.split(" ")[0]
    const isAcronym = (firstWord.match(/[A-Z]/g) || []).length > 1
    if (isAcronym || PROPER_NOUNS.includes(firstWord)) {
        return text
    }
    return text.charAt(0).toLowerCase() + text.slice(1)
}

// Describes an answer which is added part way through a label
function describeAnswerInLabel(answer: Answer): string {
    return Array.isArray(answer) ?
        answer.map(lowercaseFirstWord).join(", ")
        : lowercaseFirstWord(answer)
}

function getSavedAnswer(category: Category, pageName: string): Answer | null {
    const page = category.personalisation.find(page => page.name === pageName)
    if (page?.type === "question" && page.multipleChoice) {
        const saved = storage.getJSON(pageName)
        return Array.isArray(saved) ? saved : null
    }
    return storage.getItem(pageName) ?? null
}

/*
 * A suggestion for another category is labelled with its subcategory answer,
 * or the category name if there isn't one. A suggestion for the category the
 * user is already in also says how it differs from their answers: answers it
 * would change are listed after a colon and answers it would remove after
 * "without", eg "Food without meals" when on Food › Meals.
 * See docs/other-services-panel.md § "Turning a related search back into a flow"
 */
function getLabelForFlow(
    category: Category,
    answers: FlowAnswers,
    currentCategoryKey?: string,
): string {
    if (category.key === currentCategoryKey) {
        return getLabelForCurrentCategoryFlow(category, answers)
    }
    const subcategoryAnswer = answers[`${category.key}-subcategory`]
    const answerToSave = subcategoryAnswer && getAnswerToSave(subcategoryAnswer)
    return typeof answerToSave === "string" && !isNoAnswer(answerToSave) ?
        answerToSave
        : category.name
}

function getLabelForCurrentCategoryFlow(
    category: Category,
    answers: FlowAnswers,
): string {
    const subcategoryPageName = `${category.key}-subcategory`
    let label = category.name
    const changes: Array<string> = []
    const removals: Array<string> = []
    for (const [pageName, answer] of Object.entries(answers)) {
        const options = isAnswerOptions(answer) ? answer.oneOf : [answer]
        if (options.some(option => isSavedAnswer(pageName, option))) {
            continue
        }
        const newAnswer = getAnswerToSave(answer)
        if (isNoAnswer(newAnswer)) {
            const savedAnswer = getSavedAnswer(category, pageName)
            if (savedAnswer && !isNoAnswer(savedAnswer)) {
                removals.push(describeAnswerInLabel(savedAnswer))
            }
        } else if (pageName === subcategoryPageName) {
            label = describeAnswer(newAnswer)
        } else {
            changes.push(describeAnswerInLabel(newAnswer))
        }
    }
    if (changes.length) {
        label += `: ${changes.join(", ")}`
    }
    if (removals.length) {
        label += ` without ${removals.join(", ")}`
    }
    return label
}

/*
 * Work out where a related search should take the user, or null if it can't
 * be used.
 * See docs/other-services-panel.md § "Turning a related search back into a flow"
 */
export function getOtherServicesSuggestion(
    relatedSearch: string,
    flows: RelatedSearchFlows,
    currentCategoryKey?: string,
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
            label: getLabelForFlow(category, flow.answers, currentCategoryKey),
            target: {type: "category", category, answers: flow.answers},
        }
    }
    if (q && isPlainSearch(q)) {
        const searchText = relatedSearch.trim().replace(/\s+/g, " ")
        return {label: searchText, target: {type: "search", searchText}}
    }
    return null
}

// The answer the user would have to the page after following the flow
function getResultingAnswer(
    category: Category,
    answers: FlowAnswers,
    pageName: string,
): Answer | null {
    const answer = answers[pageName]
    if (!answer) {
        return getSavedAnswer(category, pageName)
    }
    const options = isAnswerOptions(answer) ? answer.oneOf : [answer]
    return options.find(option => isSavedAnswer(pageName, option)) ??
        getAnswerToSave(answer)
}

/*
 * Picks the fewest pages whose answers tell the flows apart, adding pages in
 * the order they're asked until every pair of flows differs in at least one.
 */
function getDistinguishingPages(
    category: Category,
    flowAnswers: Array<FlowAnswers>,
): Array<string> {
    const pageNames = category.personalisation
        .map(page => page.name)
        .filter(pageName => flowAnswers.some(answers => pageName in answers))
    let indistinguishablePairs: Array<[number, number]> = flowAnswers
        .flatMap((_, first) => flowAnswers
            .slice(first + 1)
            .map((_, index): [number, number] => [first, first + 1 + index])
        )
    const distinguishingPages: Array<string> = []
    for (const pageName of pageNames) {
        const resultingAnswers = flowAnswers.map(answers => JSON.stringify(
            getResultingAnswer(category, answers, pageName)
        ))
        const remainingPairs = indistinguishablePairs.filter(([first, second]) =>
            resultingAnswers[first] === resultingAnswers[second]
        )
        if (remainingPairs.length < indistinguishablePairs.length) {
            distinguishingPages.push(pageName)
            indistinguishablePairs = remainingPairs
        }
        if (!indistinguishablePairs.length) {
            break
        }
    }
    return distinguishingPages
}

/*
 * Suggestions for another category which would have the same label (eg two
 * "Housing" flows that differ in whether somewhere to sleep is needed
 * tonight) get the answers that tell them apart added, eg "Housing: yes" and
 * "Housing: no". Answers which would be skipped aren't shown.
 * See docs/other-services-panel.md § "Turning a related search back into a flow"
 */
function distinguishSameLabelSuggestions(
    suggestions: Array<OtherServicesSuggestion>,
    currentCategoryKey?: string,
): Array<OtherServicesSuggestion> {
    const groups = new Map<string, Array<OtherServicesSuggestion>>()
    for (const suggestion of suggestions) {
        const {target} = suggestion
        if (target.type !== "category" || target.category.key === currentCategoryKey) {
            continue
        }
        const key = `${target.category.key}\n${suggestion.label.toLowerCase()}`
        groups.set(key, [...groups.get(key) || [], suggestion])
    }

    const labels = new Map<OtherServicesSuggestion, string>()
    for (const group of groups.values()) {
        const targets = group.map(suggestion => suggestion.target)
            .filter(target => target.type === "category")
        if (group.length < 2 || targets.length !== group.length) {
            continue
        }
        const category = targets[0].category
        const flowAnswers = targets.map(target => target.answers)
        const pageNames = getDistinguishingPages(category, flowAnswers)
        group.forEach((suggestion, index) => {
            const shownAnswers = pageNames
                .filter(pageName => pageName in flowAnswers[index])
                .map(pageName =>
                    getResultingAnswer(category, flowAnswers[index], pageName)
                )
                .filter((answer): answer is Answer => !isNoAnswer(answer))
                .map(describeAnswerInLabel)
            if (shownAnswers.length) {
                labels.set(suggestion, `${suggestion.label}: ${shownAnswers.join(", ")}`)
            }
        })
    }
    return suggestions.map(suggestion => labels.has(suggestion) ?
        {...suggestion, label: labels.get(suggestion) || suggestion.label}
        : suggestion
    )
}

/*
 * Turn the related searches for the current search into suggestions,
 * dropping any which can't be used or are the current search. Suggestions
 * which would have the same label are told apart where possible, otherwise
 * only the first (most relevant) is kept.
 * See docs/other-services-panel.md § "Where suggestions come from"
 */
export function getOtherServicesSuggestions(
    relatedSearches: Array<string>,
    currentQ: string,
    flows: RelatedSearchFlows,
    currentCategoryKey?: string,
): Array<OtherServicesSuggestion> {
    const normalisedCurrentQ = normaliseIss3Q(currentQ)
    const suggestions = relatedSearches
        .filter(relatedSearch =>
            normaliseIss3Q(relatedSearch) !== normalisedCurrentQ
        )
        .map(relatedSearch => getOtherServicesSuggestion(
            relatedSearch,
            flows,
            currentCategoryKey,
        ))
        .filter((suggestion): suggestion is OtherServicesSuggestion =>
            Boolean(suggestion?.label)
        )

    const seenLabels = new Set<string>()
    return distinguishSameLabelSuggestions(suggestions, currentCategoryKey)
        .filter(suggestion => {
            const labelKey = suggestion.label.toLowerCase()
            if (seenLabels.has(labelKey)) {
                return false
            }
            seenLabels.add(labelKey)
            return true
        })
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

// Whether the user's saved answer to the page is the given answer. Only the
// first 2 selections of a (sorted) multiple choice answer affect the search.
function isSavedAnswer(pageName: string, answer: Answer): boolean {
    if (Array.isArray(answer)) {
        const saved = storage.getJSON(pageName)
        return Array.isArray(saved) &&
            JSON.stringify([...saved].sort().slice(0, 2)) ===
                JSON.stringify([...answer].sort().slice(0, 2))
    }
    return storage.getItem(pageName) === answer
}

function saveAnswer(pageName: string, answer: Answer): void {
    if (Array.isArray(answer)) {
        storage.setJSON(pageName, [...answer])
    } else {
        storage.setItem(pageName, answer)
    }
}

/*
 * Save the answers which make up the suggestion's flow, replacing any answer
 * the user gave to those pages before unless it's one of the flow's
 * equivalent answers.
 * See docs/other-services-panel.md § "What clicking a suggestion does"
 */
export function saveOtherServicesSuggestionAnswers(
    target: OtherServicesSuggestionTarget
): void {
    if (target.type !== "category") {
        return
    }
    for (const [pageName, answer] of Object.entries(target.answers)) {
        const options = isAnswerOptions(answer) ? answer.oneOf : [answer]
        if (!options.some(option => isSavedAnswer(pageName, option))) {
            saveAnswer(pageName, getAnswerToSave(answer))
        }
    }
}
