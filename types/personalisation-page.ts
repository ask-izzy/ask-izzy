import type {
    ReactNode,
} from "react"

import type { SearchQueryChanges } from "../src/iss/searchQueryBuilder";
import BaseIcon from "../src/icons/BaseIcon"
import Category from "@/src/constants/Category";

type PersonalisationAnyPage = {
    name: string,
    title: string,
    byline?: string,
    info?: string,
    getShouldShowInSummary?: (category?: Category | null | undefined) => boolean,
    noQuestionStepperBreadcrumb?: boolean,
    noQuestionStepperStep?: boolean,
    getShouldIncludePage?: (category?: Category | null | undefined) => boolean,
    summaryLabel?: string,
    summaryValue?: string,
    searchQueryChanges?: SearchQueryChanges | null,
}

// A phrase for an answer in a suggestion label. Removing the answer is
// "without <phrase>" unless a phrase for that is given too (eg "for couples"
// and "not just for couples").
export type SuggestionLabel = string | {with: string, without: string}

export type PersonalisationQuestionPage = PersonalisationAnyPage & {
    title: string,
    question: string,
    type: 'question',
    multipleChoice?: boolean,
    showSupportSearchBar?: boolean,
    possibleAnswers: {[key: string]: SearchQueryChanges},
    descriptionsForAnswers?: {[key: string]: string},
    icons?: {[key: string]: typeof BaseIcon},
    oldAnswers?: {[key: string]: string},
    prettyPrintAnswer?: (arg0: string) => string | ReactNode,
    // How an answer is described part way through a "People also searched
    // for" suggestion label when it doesn't make sense without the question
    // (eg "for people not safe tonight" rather than "No"). null means the
    // answer adds nothing worth mentioning, like skipping. "(skipped)" can be
    // given too.
    // See docs/other-services-panel.md § "Labelling suggestions"
    suggestionLabels?: {[answer: string]: SuggestionLabel | null},
    baseTextBoxComponent?: ReactNode,
    resetDfvOptionsOnDisplay?: boolean,
    resetOptionsOnDisplay?: Array<string>,
}

export type PersonalisationInfoPage = PersonalisationAnyPage & {
    type: 'info',
    baseTextBoxComponent?: ReactNode,
    heading: string,
    getDoneButtonLabel: () => string,
}

export type PersonalisationLookingForHelpPage = PersonalisationAnyPage & {
    type: 'who-is-looking-for-help',
}

export type PersonalisationLocationPage = PersonalisationAnyPage & {
    type: 'location',
}

export type PersonalisationPage =
    PersonalisationQuestionPage |
    PersonalisationInfoPage |
    PersonalisationLookingForHelpPage |
    PersonalisationLocationPage;
