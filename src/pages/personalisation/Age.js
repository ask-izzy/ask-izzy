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
            "26 to 39": append({
                q: "adults",
                age_groups: [
                    "adult",
                ],
            }),
            "40 to 54": append({
                q: "(middle-aged adults)",
                age_groups: [
                    "middleageadult",
                ],
            }),
            "55 to 64": append({
                q: "(pre-retirement aged)",
                age_groups: [
                    "preretirementage",
                ],
            }),
            "65 or older": append({
                q: "aged",
                age_groups: [
                    "agedpersons",
                ],
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
