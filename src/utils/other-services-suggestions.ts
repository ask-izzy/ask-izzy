// Browser side of the "People also searched for" suggestions. The suggestions
// themselves come from POST /api/search/related.
// See docs/other-services-panel.md § "What clicking a suggestion does"

import storage from "@/src/storage"
import {getAnswerToSave, isAnswerOptions} from "@/src/utils/flow-answers"
import type {Answer} from "@/src/utils/flow-answers"
import type {
    OtherServicesSuggestionTarget,
} from "@/types/other-services-suggestion"

/*
 * Keyword searches are shown in quotes to set them apart from categories,
 * unless the search is already quoted (eg a phrase search).
 * See docs/other-services-panel.md § "How the panel looks"
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
        return `/${target.categoryKey}`
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
