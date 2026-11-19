import categories from "@/src/constants/categories"
import Category from "@/src/constants/Category"
import storage from "@/src/storage"
import {rememberAnswersForCurrentPage} from "@/src/utils/answer-history"
import type {
    PersonalisationQuestionPage,
    SuggestionLabel,
} from "@/types/personalisation-page"

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

function getQuestionPage(
    category: Category,
    pageName: string,
): PersonalisationQuestionPage | null {
    const page = category.personalisation.find(page => page.name === pageName)
    return page?.type === "question" ? page : null
}

function getSavedAnswer(category: Category, pageName: string): Answer | null {
    if (getQuestionPage(category, pageName)?.multipleChoice) {
        const saved = storage.getJSON(pageName)
        return Array.isArray(saved) ? saved : null
    }
    return storage.getItem(pageName) ?? null
}

/*
 * How a single answer is described part way through a label, or null if it's
 * not worth mentioning (eg skipping). Pages can give phrases for answers
 * which don't make sense without the question, eg "for people not safe
 * tonight".
 */
function describeAnswerInLabel(
    category: Category,
    pageName: string,
    answer: string | null,
): SuggestionLabel | null {
    const suggestionLabels =
        getQuestionPage(category, pageName)?.suggestionLabels || {}
    if (answer !== null && answer in suggestionLabels) {
        return suggestionLabels[answer]
    }
    return isNoAnswer(answer) || answer === null ?
        null
        : lowercaseFirstWord(answer)
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

type LabelParts = {with: Array<string>, without: Array<string>}

/*
 * A detail is something a label can mention to tell suggestions apart: the
 * category, a single choice page (by name) or one answer to a multiple
 * choice page ("<page name>\n<answer>"), so that a label only mentions the
 * answers that matter rather than everything that changed on the page.
 */
const CATEGORY_DETAIL = "(category)"

function getDetailPageAndAnswer(detail: string): [string, string | null] {
    const [pageName, answer] = detail.split("\n")
    return [pageName, answer ?? null]
}

function describeAdded(label: SuggestionLabel | null): LabelParts {
    if (!label) {
        return {with: [], without: []}
    }
    return {with: [typeof label === "string" ? label : label.with], without: []}
}

// An answer with its own phrase for being removed (eg "not just for
// couples") is listed with the changes, otherwise it's put after "without"
function describeRemoved(label: SuggestionLabel | null): LabelParts {
    if (!label) {
        return {with: [], without: []}
    }
    return typeof label === "string" ?
        {with: [], without: [label]}
        : {with: [label.without], without: []}
}

// Whether following the flow would add or remove one answer to a multiple
// choice page
function describeMultipleChoiceChange(
    resulting: Answer | null,
    saved: Answer | null,
    answer: string,
    label: SuggestionLabel | null,
): LabelParts {
    const isResulting = Array.isArray(resulting) && resulting.includes(answer)
    const isSaved = Array.isArray(saved) && saved.includes(answer)
    if (isResulting === isSaved) {
        return {with: [], without: []}
    }
    return isResulting ? describeAdded(label) : describeRemoved(label)
}

/*
 * How following the flow would change the detail: the answer it would add
 * or the one it would remove. Pages the flow leaves alone, and answers the
 * user already gave, aren't mentioned.
 */
function describeChange(
    category: Category,
    answers: FlowAnswers,
    detail: string,
): LabelParts {
    const parts: LabelParts = {with: [], without: []}
    const [pageName, multipleChoiceAnswer] = getDetailPageAndAnswer(detail)
    if (!(pageName in answers)) {
        return parts
    }
    const saved = getSavedAnswer(category, pageName)
    const resulting = getResultingAnswer(category, answers, pageName)
    const describe = (answer: string | null) =>
        describeAnswerInLabel(category, pageName, answer)

    if (multipleChoiceAnswer !== null) {
        return describeMultipleChoiceChange(
            resulting,
            saved,
            multipleChoiceAnswer,
            describe(multipleChoiceAnswer),
        )
    }
    if (Array.isArray(resulting) || Array.isArray(saved)) {
        return parts
    }
    if (resulting === saved || (isNoAnswer(resulting) && isNoAnswer(saved))) {
        return parts
    }
    const resultingLabel = describe(resulting)
    return resultingLabel ?
        describeAdded(resultingLabel)
        : describeRemoved(describe(saved))
}

// A suggestion, or the current search, as something which can be labelled
type LabelItem = {
    category: Category,
    // Personalisation answers of the flow. The current search has none so is
    // never described as changing anything.
    answers: FlowAnswers,
    // The subcategory answer, or the category name if there isn't one
    base: string,
}

// Details are mentioned in the order they're asked
function getDetailOrder(category: Category, detail: string): number {
    if (detail === CATEGORY_DETAIL) {
        return -1
    }
    const [pageName, answer] = getDetailPageAndAnswer(detail)
    const pageIndex = category.personalisation
        .findIndex(page => page.name === pageName)
    const answerIndex = answer === null ? 0 : Object.keys(
        getQuestionPage(category, pageName)?.possibleAnswers || {}
    ).indexOf(answer)
    return pageIndex * 1000 + answerIndex
}

// Phrases about the same thing are merged so it isn't repeated, eg "for
// couples" and "for veterans" are "for couples and veterans"
const MERGED_PHRASE_PREFIXES = ["not just for ", "for "]

function joinPhrases(phrases: Array<string>): string {
    const groups: Array<{prefix: string, rests: Array<string>}> = []
    for (const phrase of phrases) {
        const prefix = MERGED_PHRASE_PREFIXES
            .find(prefix => phrase.startsWith(prefix)) ?? ""
        const group = prefix && groups.find(group => group.prefix === prefix)
        if (group) {
            group.rests.push(phrase.slice(prefix.length))
        } else {
            groups.push({prefix, rests: [phrase.slice(prefix.length)]})
        }
    }
    return groups.map(({prefix, rests}) => prefix + (rests.length > 1 ?
        `${rests.slice(0, -1).join(", ")} and ${rests[rests.length - 1]}`
        : rests[0]
    )).join(", ")
}

/*
 * Labels the item with just the given details. A changed answer is listed
 * after a colon and a removed one after "without". The category is put
 * before the subcategory answer (eg "Housing › Rental disputes") when it's
 * needed to tell apart the same subcategory answer in different categories.
 */
function getLabel(item: LabelItem, details: Array<string>): string {
    const withParts: Array<string> = []
    const withoutParts: Array<string> = []
    const orderedDetails = [...details].sort((first, second) =>
        getDetailOrder(item.category, first) -
            getDetailOrder(item.category, second)
    )
    for (const detail of orderedDetails) {
        if (detail !== CATEGORY_DETAIL) {
            const parts = describeChange(item.category, item.answers, detail)
            withParts.push(...parts.with)
            withoutParts.push(...parts.without)
        }
    }
    const showCategory = details.includes(CATEGORY_DETAIL) &&
        item.base !== item.category.name
    let label = showCategory ?
        `${item.category.name} › ${item.base}`
        : item.base
    if (withParts.length) {
        // Phrases starting with a joining word like "for" read on from the
        // base label without a colon, eg "Housing for couples"
        const phrases = joinPhrases(withParts)
        const startsWithJoiningWord = MERGED_PHRASE_PREFIXES
            .some(prefix => phrases.startsWith(prefix))
        label += `${startsWithJoiningWord ? " " : ": "}${phrases}`
    }
    if (withoutParts.length) {
        label += `${withParts.length ? ", without" : " without"} ` +
            withoutParts.join(" or ")
    }
    return label
}

function getBase(category: Category, answers: FlowAnswers): string {
    const subcategoryAnswer = answers[`${category.key}-subcategory`]
    const answer = subcategoryAnswer && getAnswerToSave(subcategoryAnswer)
    if (!answer || isNoAnswer(answer)) {
        return category.name
    }
    return Array.isArray(answer) ? answer.join(", ") : answer
}

// The details which could tell apart items with the same base label: the
// category if they differ, then every page any of them has an answer for
// (each answer separately for multiple choice pages). The subcategory is
// already in the base label.
function getCandidateDetails(items: Array<LabelItem>): Array<string> {
    const details: Array<string> = []
    if (new Set(items.map(item => item.category.key)).size > 1) {
        details.push(CATEGORY_DETAIL)
    }
    for (const item of items) {
        for (const page of item.category.personalisation) {
            if (
                page.name === `${item.category.key}-subcategory` ||
                !items.some(other => page.name in other.answers)
            ) {
                continue
            }
            const pageDetails = page.type === "question" && page.multipleChoice ?
                Object.keys(page.possibleAnswers)
                    .map(answer => `${page.name}\n${answer}`)
                : [page.name]
            details.push(...pageDetails.filter(detail => !details.includes(detail)))
        }
    }
    return details
}

// Every combination of the given size, in the order given
function* getDetailCombinations(
    details: Array<string>,
    size: number,
    start = 0,
): Generator<Array<string>> {
    if (size === 0) {
        yield []
        return
    }
    for (let index = start; index <= details.length - size; index++) {
        for (const rest of getDetailCombinations(details, size - 1, index + 1)) {
            yield [details[index], ...rest]
        }
    }
}

/*
 * Picks the fewest details for each suggestion's label which tell it apart
 * from every other suggestion with the same base label and from the current
 * search. Suggestions which can't be told apart from the current search are
 * dropped (null).
 */
function getMinimalLabels(
    suggestions: Array<LabelItem>,
    current: LabelItem | null,
): Array<string | null> {
    const items = current ? [...suggestions, current] : suggestions
    const sameBase = (item: LabelItem, other: LabelItem) =>
        item !== other && item.base.toLowerCase() === other.base.toLowerCase()
    const differ = (item: LabelItem, other: LabelItem, details: Array<string>) =>
        getLabel(item, details).toLowerCase() !==
            getLabel(other, details).toLowerCase()

    const chosen = suggestions.map(suggestion => {
        const others = items.filter(other => sameBase(suggestion, other))
        // Only details which tell it apart from at least one other are worth
        // trying
        const details = getCandidateDetails([suggestion, ...others])
            .filter(detail => others.some(other =>
                differ(suggestion, other, [detail])
            ))
        for (let size = 0; size <= details.length; size++) {
            for (const combination of getDetailCombinations(details, size)) {
                if (others.every(other => differ(suggestion, other, combination))) {
                    return combination
                }
            }
        }
        return details
    })

    // Different suggestions can pick different details and still end up
    // with the same label (eg two which only differ from each other by what
    // they'd leave out). Those use the details both picked.
    for (let pass = 0; pass < suggestions.length; pass++) {
        let changed = false
        suggestions.forEach((suggestion, index) => {
            suggestions.forEach((other, otherIndex) => {
                if (
                    otherIndex <= index ||
                    getLabel(suggestion, chosen[index]).toLowerCase() !==
                        getLabel(other, chosen[otherIndex]).toLowerCase()
                ) {
                    return
                }
                const union = [...new Set([...chosen[index], ...chosen[otherIndex]])]
                if (union.length > chosen[index].length ||
                    union.length > chosen[otherIndex].length) {
                    chosen[index] = union
                    chosen[otherIndex] = union
                    changed = true
                }
            })
        })
        if (!changed) {
            break
        }
    }

    return suggestions.map((suggestion, index) => {
        if (
            current &&
            sameBase(suggestion, current) &&
            !differ(suggestion, current, chosen[index])
        ) {
            return null
        }
        return getLabel(suggestion, chosen[index])
    })
}

/*
 * Work out where a related search should take the user, or null if it can't
 * be used. The label is the subcategory answer, or the category name if there
 * isn't one. getOtherServicesSuggestions() adds the details needed to tell
 * suggestions apart.
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
            label: getBase(category, flow.answers),
            target: {type: "category", category, answers: flow.answers},
        }
    }
    if (q && isPlainSearch(q)) {
        const searchText = relatedSearch.trim().replace(/\s+/g, " ")
        return {label: searchText, target: {type: "search", searchText}}
    }
    return null
}

// The current search as an item to tell suggestions apart from. Its base
// label is worked out from its own flow when it's in the table, since a
// saved subcategory answer may not be used (eg housing when not safe tonight).
function getCurrentSearchItem(
    currentQ: string,
    flows: RelatedSearchFlows,
    currentCategoryKey?: string,
): LabelItem | null {
    const category = categories.find(
        category => category.key === currentCategoryKey
    )
    if (!category) {
        return null
    }
    const flow = flows[normaliseIss3Q(currentQ)]
    const subcategoryPageName = `${category.key}-subcategory`
    let base = category.name
    const subcategoryAnswer = flow ?
        flow.answers[subcategoryPageName] &&
            getResultingAnswer(category, flow.answers, subcategoryPageName)
        : getSavedAnswer(category, subcategoryPageName)
    if (subcategoryAnswer && !isNoAnswer(subcategoryAnswer)) {
        base = Array.isArray(subcategoryAnswer) ?
            subcategoryAnswer.join(", ")
            : subcategoryAnswer
    }
    return {category, answers: {}, base}
}

/*
 * Turn the related searches for the current search into suggestions,
 * dropping any which can't be used or are the current search. Each label
 * has just enough detail to tell it apart from the other suggestions and
 * from the current search. If suggestions still share a label, only the
 * first (most relevant) is kept.
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
        .map(relatedSearch => getOtherServicesSuggestion(relatedSearch, flows))
        .filter((suggestion): suggestion is OtherServicesSuggestion =>
            Boolean(suggestion?.label)
        )

    const categorySuggestions = suggestions.filter(
        suggestion => suggestion.target.type === "category"
    )
    const labels = getMinimalLabels(
        categorySuggestions.map(suggestion => {
            const target = suggestion.target as
                Extract<OtherServicesSuggestionTarget, {type: "category"}>
            return {
                category: target.category,
                answers: target.answers,
                base: suggestion.label,
            }
        }),
        getCurrentSearchItem(currentQ, flows, currentCategoryKey),
    )
    const labelled = suggestions.flatMap(suggestion => {
        const index = categorySuggestions.indexOf(suggestion)
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

/*
 * Keyword searches are shown in quotes to set them apart from categories,
 * unless the search is already quoted (eg a phrase search).
 * See docs/other-services-panel.md § "Turning a related search back into a flow"
 */
export function quoteSearchText(text: string): string {
    const isQuoted = /^["“].*["”]$/.test(text)
    return isQuoted ? text : `“${text}”`
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
    const changes = Object.entries(target.answers).filter(([pageName, answer]) => {
        const options = isAnswerOptions(answer) ? answer.oneOf : [answer]
        return !options.some(option => isSavedAnswer(pageName, option))
    })
    // So going back shows the search from before the suggestion
    rememberAnswersForCurrentPage(changes.map(([pageName]) => pageName))
    for (const [pageName, answer] of changes) {
        saveAnswer(pageName, getAnswerToSave(answer))
    }
}
