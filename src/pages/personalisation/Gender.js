/* @flow */

import BaseQuestion, { append } from "./BaseQuestion";

export default class Gender extends BaseQuestion {
    static title = "Gender";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "gender",
        question: "Do you identify as…",
        answers: {
            "Female": append({
                q: "females"
                client_gender: ["f", "u"],
            }),
            "Male": append({
                q: "males"
                client_gender: ["m", "u"],
            }),
            "Neither/Both/Something else": append({
                client_gender: ["x", "u"],
            }),
        },
    };

    static summaryLabel = "How do you identify?";

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
}
