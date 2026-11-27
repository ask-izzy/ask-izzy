// What a clicked suggestion links to and saves.
// See docs/other-services-panel.md § "What clicking a suggestion does"

import categories from "@/src/constants/categories"
import storage from "@/src/storage"
import {
    getAnswerToSave,
    isAnswer,
    isAnswerOptions,
    isSameAnswer,
} from "@/src/utils/flow-answers"
import type {Answer} from "@/src/utils/flow-answers"
import type {
    CurrentAnswers,
    OtherServicesSuggestionTarget,
} from "@/types/other-services-suggestion"

/*
 * The saved answer to every personalisation question, sent to
 * POST /api/search/related for labelling.
 * See docs/other-services-panel.md § "Labelling suggestions"
 */
export function getCurrentAnswers(): CurrentAnswers {
    const answers: CurrentAnswers = {}
    for (const category of categories) {
        for (const page of category.personalisation) {
            if (page.type !== "question" || page.name in answers) {
                continue
            }
            const answer = page.multipleChoice ?
                storage.getJSON(page.name)
                : storage.getItem(page.name)
            if (isAnswer(answer)) {
                answers[page.name] = answer
            }
        }
    }
    return answers
}

/*
 * Keyword searches are shown in quotes to set them apart from categories,
 * unless the search is already quoted.
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

function isSavedAnswer(pageName: string, answer: Answer): boolean {
    const saved = Array.isArray(answer) ?
        storage.getJSON(pageName)
        : storage.getItem(pageName)
    return isSameAnswer(saved, answer)
}

function saveAnswer(pageName: string, answer: Answer): void {
    if (Array.isArray(answer)) {
        // Copied since setJSON() sorts in place
        storage.setJSON(pageName, [...answer])
    } else {
        storage.setItem(pageName, answer)
    }
}

/*
 * Save the flow's answers, keeping the user's existing answer where it's one
 * of the oneOf options.
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
