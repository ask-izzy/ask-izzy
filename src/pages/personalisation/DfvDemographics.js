/* @flow */
import * as React from "react";
import type {Node as ReactNode} from "react";
import BaseQuestion from "./BaseQuestion";

import icons from "../../icons";
import storage from "../../storage";

import Under18Page from "./Under18DomesticViolenceScreen";
import LgbtiqaPage from "./LgbtiqaDomesticViolenceScreen";
import UsingViolencePage from "./UsingViolenceScreen";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

const ATSI_BREADCRUMB_ICON = (
    <span>
        <icons.AboriginalFlag/>
        <icons.TorresStraitIslandersFlag />
    </span>
)
const LGBT_BREADCRUMB_ICON = (
    <span><icons.DemographicLgbtiq viewBox="2 9 59 44" /></span>
)

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "dfv-demographics",
    question: "Do any of these apply to you?",
    byline: "Select all that apply",
    info: "All of your answers are private and anonymous.",
    multipleChoice: true,
    possibleAnswers: {
        "Aboriginal and/or Torres Strait Islander": {
            $concat: {
                term: ["\"Aboriginals & Torres Strait Islanders\""],
            },
        },
        "Experiencing violence": {},
        "Under 18": {},
        "LGBTIQA+": {},
        "Culturally and linguistically diverse": {
            $concat: {
                term: ["ethnic"],
            },
        },
        "Person seeking asylum": {
            $concat: {
                term: ["refugees"],
            },
        },
        "Using violence": {},
    },
    icons: {
        "Aboriginal and/or Torres Strait Islander": icons.DemographicAtsi,
        "Experiencing violence": icons.ExperiencingViolence,
        "Under 18": icons.Under18,
        "LGBTIQA+": icons.DemographicLgbtiq,
        "Culturally and linguistically diverse":
            icons.DemographicNeedInterpreter,
        "Person seeking asylum": icons.DemographicRecentlyArrived,
        "Using violence": icons.UsingViolence,
    },
    oldAnswers: {},
}

export default class DfvDemographics extends BaseQuestion {
    static title: string = "Personal";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    componentDidMount(): void {
        if (super.componentDidMount) {
            super.componentDidMount();
        }

        storage.removeItem(Under18Page.defaultProps.name);
        storage.removeItem(LgbtiqaPage.defaultProps.name);
        storage.removeItem(UsingViolencePage.defaultProps.name);
    }

    static prettyPrintAnswer(answer: string): ReactNode {
        switch (answer) {
        case "Aboriginal and/or Torres Strait Islander":
            return ATSI_BREADCRUMB_ICON;
        case "LGBTIQA+":
            return LGBT_BREADCRUMB_ICON;
        case "Culturally and linguistically diverse":
            return "Culturally & linguistically diverse";
        case "Person seeking asylum":
            return "Seeking asylum";
        default:
            return answer;
        }
    }
}
