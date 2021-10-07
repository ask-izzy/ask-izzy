/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";

export default class Gender extends BaseQuestion {
    static title: string = "Gender";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "gender",
        question: "Do you identify as…",
        possibleAnswers: {
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
        switch (this.savedAnswer) {
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

    static prettyPrintSavedAnswer(): string | Array<string> {
        switch (this.savedAnswer) {
        case "Male":
            return "Men";
        case "Female":
            return "Women";
        case "Trans and Gender Diverse":
            return "Trans & Gender Diverse";
        default:
            return this.savedAnswer;
        }
    }
}
