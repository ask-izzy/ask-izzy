import {ReactNode} from "react"

import type { SearchQueryChanges } from "@/src/iss/searchQueryBuilder"
import BaseIcon from "@/src/icons/BaseIcon"

type PersonalisationAnyPage = {
    name: string,
    title: string,
    byline?: string,
    info?: string,
    shouldShowInSummary?: boolean,
    noQuestionStepperBreadcrumb?: boolean,
    noQuestionStepperStep?: boolean,
    getShouldIncludePage?: () => boolean,
    summaryLabel?: string,
    summaryValue?: string,
    searchQueryChanges?: SearchQueryChanges | null,
    prettyPrintAnswer?: () => undefined,
    multipleChoice?: undefined,
    oldAnswers?: undefined,
    possibleAnswers?: any,
}

export type PersonalisationQuestionPage = {
    title: string;
    question: string;
    type: "question";
    multipleChoice?: boolean;
    showSupportSearchBar?: boolean;
    possibleAnswers: Record<string, SearchQueryChanges>;
    descriptionsForAnswers?: Record<string, string>;
    icons?: Record<string, typeof BaseIcon>;
    oldAnswers?: Record<string, string>;
    prettyPrintAnswer?: (arg0: string) => string | ReactNode;
    baseTextBoxComponent?: ReactNode;
    resetDfvOptionsOnDisplay?: boolean;
    resetOptionsOnDisplay?: Array<string>;
} & PersonalisationAnyPage;

export type PersonalisationInfoPage = {
    type: "info",
    baseTextBoxComponent?: ReactNode,
    heading: string,
    getDoneButtonLabel: () => string,
} & PersonalisationAnyPage

export type PersonalisationLookingForHelpPage = {
    type: "who-is-looking-for-help",
    prettyPrintAnswer?: undefined,
} & PersonalisationAnyPage

export type PersonalisationLocationPage = {
    type: "location",
} & PersonalisationAnyPage

export type PersonalisationPage =
    PersonalisationQuestionPage |
    PersonalisationInfoPage |
    PersonalisationLookingForHelpPage |
    PersonalisationLocationPage
