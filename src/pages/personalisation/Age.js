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
            "26 to 39": append(""),
            "40 to 54": append(""),
            "55 to 64": append(""),
            "65 or older": append(""),
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
