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
