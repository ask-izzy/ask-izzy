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
