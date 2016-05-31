/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

import { append } from "../../iss/Search";
import icons from "../../icons";

export default class HealthDemographics extends BaseMultiQuestion {
    static title = "Personal";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "health-demographics",
        question: "Do any of these apply to you?",
        answers: {
            "Aboriginal": append("Aboriginals & Torres Strait Islanders"),
            "Torres Strait Islander":
                append("Aboriginals & Torres Strait Islanders"),
        },
        icons: {
            "Aboriginal": icons.DemographicAboriginal,
            "Torres Strait Islander": icons.DemographicTorresStrait,
        },
    };
}
