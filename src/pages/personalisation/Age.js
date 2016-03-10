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
                age_groups: [
                    "unspecified",
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
                    "unspecified",
                    "adult",
                ],
            }),
            "40 to 54": append({
                age_groups: [
                    "unspecified",
                    "middleageadult",
                ],
            }),
            "55 to 64": append({
                age_groups: [
                    "unspecified",
                    "preretirementage",
                ],
            }),
            "65 or older": append({
                age_groups: [
                    "unspecified",
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
