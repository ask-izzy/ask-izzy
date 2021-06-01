/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";

export default class Gender extends BaseQuestion {
    static title = "Gender";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "gender",
        question: "Do you identify as…",
        answers: {
            "Female": append({
                client_gender: ["f", "u"],
            }),
            "Male": append({
                client_gender: ["m", "u"],
            }),
            "Trans and Gender Diverse": append({
                client_gender: ["x", "u"],
            }),
        },
    };

    static get summaryLabel(): string {
        return "How do you identify?";
    }

    static headingValue(): string {
        switch (this.answer) {
        case "Male":
            return "for men";
        case "Female":
            return "for women";
        default:
            // important to not return "" here because it will
            // be followed by the age string and otherwise would
            // say "42 services aged 26 or younger"
            return "for people";
        }
    }

    static breadcrumbAnswer(): string {
        switch (this.answer) {
        case "Male":
            return "Man";
        case "Female":
            return "Woman";
        default:
            return this.answer;
        }
    }
}
