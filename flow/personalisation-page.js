/* @flow */
import type {
    Node as ReactNode,
} from "react"

import type { SearchQueryChanges } from "../src/iss/searchQueryBuilder";
import BaseIcon from "../src/icons/BaseIcon"
import Category from "@/src/constants/Category";

type PersonalisationAnyPage = {|
    name: string,
    title: string,
    byline?: string,
    info?: string,
    getShouldShowInSummary?: (category: ?Category) => boolean,
    noQuestionStepperBreadcrumb?: boolean,
    noQuestionStepperStep?: boolean,
    getShouldIncludePage?: (category: ?Category) => boolean,
    summaryLabel?: string,
    summaryValue?: string,
    searchQueryChanges?: SearchQueryChanges | null,
|}

export type PersonalisationQuestionPage = {|
    ...PersonalisationAnyPage,
    title: string,
    question: string,
    type: 'question',
    multipleChoice?: boolean,
    showSupportSearchBar?: boolean,
    possibleAnswers: {[string]: SearchQueryChanges},
    descriptionsForAnswers?: {[string]: string},
    icons?: {[string]: typeof BaseIcon},
    oldAnswers?: {[string]: string},
    prettyPrintAnswer?: (string) => string | ReactNode,
    baseTextBoxComponent?: ReactNode,
    resetDfvOptionsOnDisplay?: boolean,
    resetOptionsOnDisplay?: Array<string>,
|}

export type PersonalisationInfoPage = {|
    ...PersonalisationAnyPage,
    type: 'info',
    baseTextBoxComponent?: ReactNode,
    heading: string,
    getDoneButtonLabel: () => string,
|}

export type PersonalisationLookingForHelpPage = {|
    ...PersonalisationAnyPage,
    type: 'who-is-looking-for-help',
|}

export type PersonalisationLocationPage = {|
    ...PersonalisationAnyPage,
    type: 'location',
|}

export type PersonalisationPage =
    PersonalisationQuestionPage |
    PersonalisationInfoPage |
    PersonalisationLookingForHelpPage |
    PersonalisationLocationPage;
