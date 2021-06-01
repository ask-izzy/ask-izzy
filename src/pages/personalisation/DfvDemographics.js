/* @flow */

import * as React from "react";
import BaseMultiQuestion from "./BaseMultiQuestion";

import { append } from "../../iss/Search";
import icons from "../../icons";
import storage from "../../storage";

import Under18Page from "./Under18DomesticViolenceScreen";
import LgbtiqaPage from "./LgbtiqaDomesticViolenceScreen";
import UsingViolencePage from "./UsingViolenceScreen";

export default class DfvDemographics extends BaseMultiQuestion {
    static title = "Personal";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
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


    static breadcrumbAnswer(): ?Array<any> {

        if (this.answer && this.answer.length) {
            return this.answer.map((answer, index) => {
                switch (answer) {
                case "Aboriginal and/or Torres Strait Islander":
                    return (
                        <span>
                            <icons.AboriginalFlag/>
                            <icons.TorresStraitIslandersFlag />
                        </span>
                    );
                case "LGBTIQA+":
                    return <span><icons.DemographicLgbtiq /></span>
                default:
                    return answer;
                }
            })
        }
        return this.answer
    }
}
