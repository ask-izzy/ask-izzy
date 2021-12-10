/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import * as React from "react";
import type {Node as ReactNode} from "react";
import BaseQuestion from "./BaseQuestion";

import { append } from "../../iss/ServiceSearchRequest";
import DemographicLgbtiq from "../../icons/demographic-lgbtiq.svg";
import AboriginalFlag from "../../icons/aboriginal-flag.svg";
import TorresStraitIslandersFlag from "../../icons/torres-strait-islanders-flag.svg";
import DemographicAtsi from "../../icons/demographic-atsi.svg";
import ExperiencingViolence from "../../icons/experiencing-violence.svg";
import Under18 from "../../icons/under-18.svg";
import DemographicNeedInterpreter from "../../icons/demographic-need-interpreter.svg";
import DemographicRecentlyArrived from "../../icons/demographic-recently-arrived.svg";
import UsingViolence from "../../icons/using-violence.svg";
import storage from "../../storage";

import Under18Page from "./Under18DomesticViolenceScreen";
import LgbtiqaPage from "./LgbtiqaDomesticViolenceScreen";
import UsingViolencePage from "./UsingViolenceScreen";

const ATSI_BREADCRUMB_ICON = (
    <span>
        <AboriginalFlag/>
        <TorresStraitIslandersFlag />
    </span>
)
const LGBT_BREADCRUMB_ICON = (
    <span><DemographicLgbtiq viewBox="2 9 59 44" /></span>
)

export default class DfvDemographics extends BaseQuestion {
    static title: string = "Personal";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "dfv-demographics",
        question: "Do any of these apply to you?",
        byline: "Select all that apply",
        info: "All of your answers are private and anonymous.",
        multipleChoice: true,
        possibleAnswers: {
            "Aboriginal and/or Torres Strait Islander":
                append("(Aboriginals & Torres Strait Islanders)"),
            "Experiencing violence": append(""),
            "Under 18": append(""),
            "LGBTIQA+": append(""),
            "Culturally and linguistically diverse": append("ethnic"),
            "Person seeking asylum": append("refugees"),
            "Using violence": append(""),
        },
        icons: {
            "Aboriginal and/or Torres Strait Islander": DemographicAtsi,
            "Experiencing violence": ExperiencingViolence,
            "Under 18": Under18,
            "LGBTIQA+": DemographicLgbtiq,
            "Culturally and linguistically diverse":
                DemographicNeedInterpreter,
            "Person seeking asylum": DemographicRecentlyArrived,
            "Using violence": UsingViolence,
        },
        oldAnswers: {},
    };

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
