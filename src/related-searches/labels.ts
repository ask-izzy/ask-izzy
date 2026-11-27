// Server only: labels "People also searched for" suggestions with just
// enough detail to tell them apart from each other and the current search,
// relative to the user's current answers.
// See docs/other-services-panel.md § "Labelling suggestions"

import categories from "@/src/constants/categories"
import Category from "@/src/constants/Category"
import {
    getAnswerToSave,
    getSearchedSelections,
    isAnswerOptions,
    isNoAnswer,
    isSameAnswer,
} from "@/src/utils/flow-answers"
import type {Answer, FlowAnswers} from "@/src/utils/flow-answers"
import type {CurrentAnswers} from "@/types/other-services-suggestion"
import type {
    PersonalisationQuestionPage,
    SuggestionLabel,
} from "@/types/personalisation-page"

// A suggestion, or the current search, as something which can be labelled
export type LabelItem = {
    category: Category,
    // The flow's answers. Empty for the current search, so it's never
    // described as changing anything.
    answers: FlowAnswers,
    // The subcategory answer, or the category name if there isn't one
    base: string,
}

// Proper nouns which can start an answer
const PROPER_NOUNS = ["Aboriginal", "Centrelink", "I", "I'm"]

/*
 * Answers are in sentence case so when one is added part way through a label
 * its first word is lowercased, unless it's an acronym (eg "LGBTIQA+") or a
 * proper noun. Any other capitals in an answer are intentional.
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

// The saved answer, or null if it's the wrong shape for the page (it comes
// from the browser)
function getSavedAnswer(
    currentAnswers: CurrentAnswers,
    category: Category,
    pageName: string,
): Answer | null {
    const saved = currentAnswers[pageName]
    if (getQuestionPage(category, pageName)?.multipleChoice) {
        return Array.isArray(saved) ? saved : null
    }
    return typeof saved === "string" ? saved : null
}

/*
 * How an answer reads in a label: the page's suggestionLabels phrase, else
 * the answer. null if it's not worth mentioning (eg skipping).
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
    currentAnswers: CurrentAnswers,
    category: Category,
    answers: FlowAnswers,
    pageName: string,
): Answer | null {
    const answer = answers[pageName]
    if (!answer) {
        return getSavedAnswer(currentAnswers, category, pageName)
    }
    const options = isAnswerOptions(answer) ? answer.oneOf : [answer]
    return options.find(option =>
        isSameAnswer(currentAnswers[pageName], option)
    ) ?? getAnswerToSave(answer)
}

// Phrases which follow the base label, and ones which follow "without"
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

// Describes the flow adding or removing one answer to a multiple choice page,
// if it does. Only the selections which affect the search count.
function describeMultipleChoiceChange(
    resulting: Answer | null,
    saved: Answer | null,
    answer: string,
    label: SuggestionLabel | null,
): LabelParts {
    const isSearched = (selections: Answer | null) =>
        Array.isArray(selections) &&
            getSearchedSelections(selections).includes(answer)
    const isResulting = isSearched(resulting)
    const isSaved = isSearched(saved)
    if (isResulting === isSaved) {
        return {with: [], without: []}
    }
    return isResulting ? describeAdded(label) : describeRemoved(label)
}

// What the flow would add to or remove from the detail. Untouched pages and
// answers the user already has give nothing.
function describeChange(
    currentAnswers: CurrentAnswers,
    item: LabelItem,
    detail: string,
): LabelParts {
    const {category, answers} = item
    const parts: LabelParts = {with: [], without: []}
    const [pageName, multipleChoiceAnswer] = getDetailPageAndAnswer(detail)
    if (!(pageName in answers)) {
        return parts
    }
    const saved = getSavedAnswer(currentAnswers, category, pageName)
    const resulting =
        getResultingAnswer(currentAnswers, category, answers, pageName)
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
    // Single choice detail. Arrays only get here if the table and page disagree.
    if (Array.isArray(resulting) || Array.isArray(saved)) {
        return parts
    }
    // Skipping and never answering give the same search
    if (resulting === saved || (isNoAnswer(resulting) && isNoAnswer(saved))) {
        return parts
    }
    const resultingLabel = describe(resulting)
    // Changing to an answer not worth mentioning (eg skipping) reads as
    // removing the saved one
    return resultingLabel ?
        describeAdded(resultingLabel)
        : describeRemoved(describe(saved))
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
 * Labels the item with only the given details: "<category> › <base>" when the
 * category is needed, then changed answers, then removed ones after
 * "without".
 */
function getLabel(
    currentAnswers: CurrentAnswers,
    item: LabelItem,
    details: Array<string>,
): string {
    const withParts: Array<string> = []
    const withoutParts: Array<string> = []
    const orderedDetails = [...details].sort((first, second) =>
        getDetailOrder(item.category, first) -
            getDetailOrder(item.category, second)
    )
    for (const detail of orderedDetails) {
        if (detail !== CATEGORY_DETAIL) {
            const parts = describeChange(currentAnswers, item, detail)
            withParts.push(...parts.with)
            withoutParts.push(...parts.without)
        }
    }
    const showCategory = details.includes(CATEGORY_DETAIL) &&
        // Avoids "Housing › Housing"
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

// Details which could tell apart items sharing a base label. The subcategory
// page is skipped since it's the base label.
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
export function getMinimalLabels(
    suggestions: Array<LabelItem>,
    current: LabelItem | null,
    currentAnswers: CurrentAnswers,
): Array<string | null> {
    const items = current ? [...suggestions, current] : suggestions
    // Compared ignoring case, like the final dedupe in suggestions.ts
    const label = (item: LabelItem, details: Array<string>) =>
        getLabel(currentAnswers, item, details).toLowerCase()
    const sameBase = (item: LabelItem, other: LabelItem) =>
        item !== other && item.base.toLowerCase() === other.base.toLowerCase()
    const differ = (item: LabelItem, other: LabelItem, details: Array<string>) =>
        label(item, details) !== label(other, details)

    const chosen = suggestions.map(suggestion => {
        const others = items.filter(other => sameBase(suggestion, other))
        // Only details which tell it apart from some other are worth trying
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
        // Nothing tells them apart: use everything (deduped or dropped later)
        return details
    })

    // Different suggestions can pick different details and still end up
    // with the same label (eg two which only differ from each other by what
    // they'd leave out). Those use the details both picked, until nothing
    // changes.
    for (let pass = 0; pass < suggestions.length; pass++) {
        let changed = false
        suggestions.forEach((suggestion, index) => {
            suggestions.forEach((other, otherIndex) => {
                if (
                    otherIndex <= index ||
                    label(suggestion, chosen[index]) !==
                        label(other, chosen[otherIndex])
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
        return getLabel(currentAnswers, suggestion, chosen[index])
    })
}

// The current search as an item to tell suggestions apart from. Its base
// label is worked out from its own flow when it's in the lookup table, since
// a saved subcategory answer may not be used (eg housing when not safe
// tonight).
export function getCurrentSearchItem(
    currentFlowAnswers: FlowAnswers | null,
    currentCategoryKey: string | undefined,
    currentAnswers: CurrentAnswers,
): LabelItem | null {
    const category = categories.find(
        category => category.key === currentCategoryKey
    )
    if (!category) {
        return null
    }
    const subcategoryPageName = `${category.key}-subcategory`
    let base = category.name
    const subcategoryAnswer = currentFlowAnswers ?
        currentFlowAnswers[subcategoryPageName] && getResultingAnswer(
            currentAnswers,
            category,
            currentFlowAnswers,
            subcategoryPageName,
        )
        : getSavedAnswer(currentAnswers, category, subcategoryPageName)
    if (subcategoryAnswer && !isNoAnswer(subcategoryAnswer)) {
        base = Array.isArray(subcategoryAnswer) ?
            subcategoryAnswer.join(", ")
            : subcategoryAnswer
    }
    return {category, answers: {}, base}
}
