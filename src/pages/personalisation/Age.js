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
                age_groups: [
                    "adult",
                ],
            }),
            "40 to 54": append({
                age_groups: [
                    "middleageadult",
                ],
            }),
            "55 to 64": append({
                age_groups: [
                    "preretirementage",
                ],
            }),
            "65 or older": append({
                age_groups: [
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
