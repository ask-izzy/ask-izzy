// Personalisation answers which make up a "flow": the category and answers
// which produce an ISS3 "q" value. Used on both the server (turning related
// searches into suggestions) and the client (saving a suggestion's answers),
// so this mustn't import anything from either side.
// See docs/other-services-panel.md § "Turning a related search back into a flow"

// A single choice answer, or the selections of a multiple choice page
export type Answer = string | Array<string>

// Any of these answers produce the same "q" value. The first is saved unless
// the user has already given one of them.
export type AnswerOptions = {oneOf: Array<Answer>}

// Keyed by personalisation page name
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

// The answer saved for anyone who hasn't already given one of the flow's
// answers: skipping (or selecting nothing) if that's an option, otherwise any
// of them since they all give the same search.
// See docs/other-services-panel.md § "What clicking a suggestion does"
export function getAnswerToSave(answer: Answer | AnswerOptions): Answer {
    if (!isAnswerOptions(answer)) {
        return answer
    }
    return answer.oneOf.find(option => isNoAnswer(option)) ?? answer.oneOf[0]
}
