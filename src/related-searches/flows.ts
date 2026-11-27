// Server only: the lookup table from ISS3 "q" values to the flows which
// produce them. Generated at build time and never sent to the browser.
// See docs/other-services-panel.md § "Turning a related search back into a flow"

import type {FlowAnswers} from "@/src/utils/flow-answers"

// The category and personalisation answers which produce an ISS3 "q" value
export type RelatedSearchFlow = {
    category: string,
    answers: FlowAnswers,
}

// Normalised ISS3 "q" values to the flow which produces them
export type RelatedSearchFlows = {[q: string]: RelatedSearchFlow}

// Makes ISS3 "q" values comparable regardless of case or spacing
export function normaliseIss3Q(q: string): string {
    return q.toLowerCase().replace(/\s+/g, " ").trim()
}
