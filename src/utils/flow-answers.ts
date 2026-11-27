// The answers in a "flow" (the category and answers which produce an ISS3 "q"
// value). Shared by the server (related searches) and the browser (saving a
// suggestion's answers), so it mustn't import from either.
// See docs/other-services-panel.md § "Turning a related search back into a flow"

// A single choice answer, or the selections of a multiple choice page
export type Answer = string | Array<string>

// Any of these answers produce the same "q" value
export type AnswerOptions = {oneOf: Array<Answer>}

export type FlowAnswers = {[personalisationPageName: string]: Answer | AnswerOptions}
