/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

import { append } from "../../iss/Search";
import icons from "../../icons";

export default class DemographicsNarrowed extends BaseMultiQuestion {
    static title = "Personal";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "demographics",
        question: "Do any of these apply to you?",
        answers: {
            // n.b. see also storage.getUserIsIndigenous when changing
            "Aboriginal and/or Torres Strait Islander":
                append("(Aboriginals & Torres Strait Islanders)"),
            "Have a disability": append("disabilities"),
            "LGBTIQA+": append("(Gender & Sexuality)"),
            "Person seeking asylum": append("refugees"),
            "Under 18": append("(Under 18)"),
        },
        icons: {
            "Aboriginal and/or Torres Strait Islander": icons.DemographicAtsi,
            "Have a disability": icons.DemographicDisability,
            "LGBTIQA+": icons.DemographicLgbtiq,
            "Person seeking asylum": icons.DemographicRecentlyArrived,
        },
        oldAnswers: {
            "Indigenous": "Aboriginal and/or Torres Strait Islander",
            "Aboriginal": "Aboriginal and/or Torres Strait Islander",
        },
    };
}
