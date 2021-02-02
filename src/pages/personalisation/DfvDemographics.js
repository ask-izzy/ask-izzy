/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

import { append } from "../../iss/Search";
import DemographicAtsi from "../../icons/demographic-atsi.svg";
import ExperiencingViolence from "../../icons/experiencing-violence.svg";
import Under18 from "../../icons/under-18.svg";
import DemographicLgbtiq from "../../icons/demographic-lgbtiq.svg";
import DemographicNeedInterpreter from "../../icons/demographic-need-interpreter.svg";
import DemographicRecentlyArrived from "../../icons/demographic-recently-arrived.svg";
import UsingViolence from "../../icons/using-violence.svg";
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
}
