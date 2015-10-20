/* @flow */

import BaseQuestion, { append } from "./BaseQuestion";

export default class Age extends BaseQuestion {
    // flow:disable
    static defaultProps = {
        name: "age",
        question: "How old are you?",
        answers: {
            "25 or younger": append({
                q: "youth",
                age_groups: [
                    "prenatal",
                    "baby",
                    "toddler",
                    "preschool",
                    "schoolage",
                    "earlyadolescent",
                    "midadolescent",
                    "lateadolescent",
                    "youngadult",
                ],
            }),
            "26 to 64": append({
                age_groups: [
                    "adult",
                    "middleageadult",
                ],
            }),
            "65 or older": append({
                age_groups: [
                    "preretirementage",
                    "agedpersons",
                ],
            }),
        },
    };

    // flow:disable
    static get headingValue() {
        return `aged ${this.answer}`;
    }
}
