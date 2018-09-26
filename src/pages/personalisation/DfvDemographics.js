/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

import { append } from "../../iss/Search";
import icons from "../../icons";

export default class DfvDemographics extends BaseMultiQuestion {
    static title = "Personal";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "dfv-demographics",
        question: "Do any of these apply to you?",
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
}
