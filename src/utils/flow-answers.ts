// The answers in a "flow" (the category and answers which produce an ISS3 "q"
// value). Shared by the server (related searches) and the browser (saving a
// suggestion's answers), so it mustn't import from either.
// See docs/other-services-panel.md § "Turning a related search back into a flow"

// A single choice answer, or the selections of a multiple choice page
export type Answer = string | Array<string>

// Any of these answers produce the same "q" value
export type AnswerOptions = {oneOf: Array<Answer>}

export type FlowAnswers = {[personalisationPageName: string]: Answer | AnswerOptions}

export function isAnswerOptions(
    answer: Answer | AnswerOptions | null | undefined
): answer is AnswerOptions {
    return Boolean(answer) && typeof answer === "object" && "oneOf" in answer
}

// Skipping, or selecting nothing on a multiple choice page
export function isNoAnswer(answer: Answer | null | undefined): boolean {
    return !answer || answer === "(skipped)" ||
        (Array.isArray(answer) && answer.length === 0)
}

// Skipping (or selecting nothing) if it's one of the options, otherwise the
// first (they all give the same "q").
// See docs/other-services-panel.md § "Turning a related search back into a flow"
export function getAnswerToSave(answer: Answer | AnswerOptions): Answer {
    if (!isAnswerOptions(answer)) {
        return answer
    }
    return answer.oneOf.find(option => isNoAnswer(option)) ?? answer.oneOf[0]
}
