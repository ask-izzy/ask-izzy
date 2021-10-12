/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import * as React from "react";
import type {Node as ReactNode} from "react";
import BaseMultiQuestion from "./BaseMultiQuestion";

import { append } from "../../iss/ServiceSearchRequest";
import icons from "../../icons";
import storage from "../../storage";

import Under18Page from "./Under18DomesticViolenceScreen";
import LgbtiqaPage from "./LgbtiqaDomesticViolenceScreen";
import UsingViolencePage from "./UsingViolenceScreen";

const ATSI_BREADCRUMB_ICON = (
    <span>
        <icons.AboriginalFlag/>
        <icons.TorresStraitIslandersFlag />
    </span>
)
const LGBT_BREADCRUMB_ICON = (
    <span><icons.DemographicLgbtiq /></span>
)

export default class DfvDemographics extends BaseMultiQuestion {
    static title: string = "Personal";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseMultiQuestion> = {
        name: "dfv-demographics",
        question: "Do any of these apply to you?",
        byline: "Select all that apply",
        info: "All of your answers are private and anonymous.",
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
    };

    componentDidMount(): void {
        if (super.componentDidMount) {
            super.componentDidMount();
        }

        storage.removeItem(Under18Page.defaultProps.name);
        storage.removeItem(LgbtiqaPage.defaultProps.name);
        storage.removeItem(UsingViolencePage.defaultProps.name);
    }


    static breadcrumbToStandardAnswer(
        prettyPrintSavedAnswer?: ?Array<any>
    ): string {
        if (this.savedAnswer && this.savedAnswer.length) {
            for (let index = 0; index < this.savedAnswer.length; index++) {
                if (prettyPrintSavedAnswer === ATSI_BREADCRUMB_ICON &&
                    this.savedAnswer[index] ===
                    "Aboriginal and/or Torres Strait Islander") {
                    return this.savedAnswer[index];
                } else if (prettyPrintSavedAnswer === LGBT_BREADCRUMB_ICON &&
                    this.savedAnswer[index] === "LGBTIQA+") {
                    return this.savedAnswer[index];
                } else if (
                    // $FlowIgnore
                    this.prettyPrintSavedAnswer()[index] ===
                        prettyPrintSavedAnswer
                ) {
                    // $FlowIgnore
                    return this.savedAnswer[index]
                }
            }
        }
        return "";
    }

    static prettyPrintSavedAnswer(): ReactNode {
        const savedAnswer = this.savedAnswer instanceof Array ?
            this.savedAnswer
            : []
        return savedAnswer.map((answer, index) => {
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
        })
    }
}
