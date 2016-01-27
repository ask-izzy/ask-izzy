/* @flow */

import BaseQuestion, { append } from "./BaseQuestion";

export default class Age extends BaseQuestion {
    static title = "Age";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "age",
        question: "How old are you?",
        answers: {
            "25 or younger": append({
                q: "youth",
            }),
            "26 to 39": append({
                q: "",
            }),
            "40 to 54": append({
                q: "",
            }),
            "55 to 64": append({
                q: "",
            }),
            "65 or older": append({
                q: "aged",
                minimum_should_match: "30%",
            }),
        },
    };

    static headingValue(): string {
        if (!this.answer || (this.answer == "(skipped)")) {
            return "";
        } else {
            return `aged ${this.answer}`;
        }
    }
}
