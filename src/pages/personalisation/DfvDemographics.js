/* @flow */

import * as React from "react";
import BaseMultiQuestion from "./BaseMultiQuestion";

import { append } from "../../iss/Search";
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
    static title: any = "Personal";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps: any = {
        name: "dfv-demographics",
        question: "Do any of these apply to you?",
        byline: "All of your answers are private and anonymous",
        answers: {
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


    static breadcrumbToStandardAnswer(breadcrumbAnswer?: ?Array<any>): string {
        if (this.answer && this.answer.length) {
            for (let index: number = 0; index < this.answer.length; index++) {
                if (breadcrumbAnswer === ATSI_BREADCRUMB_ICON &&
                    this.answer[index] ===
                    "Aboriginal and/or Torres Strait Islander") {
                    return this.answer[index];
                } else if (breadcrumbAnswer === LGBT_BREADCRUMB_ICON &&
                    this.answer[index] === "LGBTIQA+") {
                    return this.answer[index];
                } else if (
                    // $FlowIgnore
                    this.breadcrumbAnswer()[index] === breadcrumbAnswer) {
                    // $FlowIgnore
                    return this.answer[index]
                }
            }
        }
        return "";
    }

    static breadcrumbAnswer(): ?Array<any> {
        if (this.answer && this.answer.length) {
            return this.answer.map((answer, index) => {
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
        return this.answer
    }
}
