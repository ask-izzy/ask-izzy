/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";

function ageGroups(
    ...groups: Array<issAgeGroup>
): {age_group: Array<issAgeGroup>} {
    return {
        age_group: ["unspecified"].concat(groups),
    }
}

export default class Age extends BaseQuestion {
    static title = "Age";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "age",
        question: "How old are you?",
        answers: {
            "0 to 5": append(ageGroups(
                "prenatal",
                "baby",
                "toddler",
                "preschool",
            )),
            "6 to 11": append(ageGroups(
                "schoolage",
            )),
            "12 or 13": append(ageGroups(
                "earlyadolescent",
            )),
            "14 or 15": append(ageGroups(
                "midadolescent",
            )),
            "16 or 17": append(ageGroups(
                "lateadolescent",
            )),
            "18 to 26": append(ageGroups(
                "youngadult",
            )),
            "27 to 39": append(ageGroups(
                "adult",
            )),
            "40 to 54": append(ageGroups(
                "middleageadult",
            )),
            "55 to 64": append(ageGroups(
                "preretirementage",
            )),
            "65 or older": append(ageGroups(
                "agedpersons",
            )),
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
