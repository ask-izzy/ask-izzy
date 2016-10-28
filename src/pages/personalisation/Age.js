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
            )).append("children"),
            "6 to 11": append(ageGroups(
                "schoolage",
            )).append("children"),
            "12 or 13": append(ageGroups(
                "earlyadolescent",
            )).append("children"),
            "14 or 15": append(ageGroups(
                "midadolescent",
            )).append("youth"),
            "16 or 17": append(ageGroups(
                "lateadolescent",
            )).append("youth"),
            "18 to 26": append(ageGroups(
                "youngadult",
            )),
            "27 to 39": append(ageGroups(
                "adult",
            )),
            "40 to 54": append(ageGroups(
                "middleagedadult",
            )),
            "55 to 64": append(ageGroups(
                "preretirementage",
            )),
            "65 or older": append(ageGroups(
                "agedpersons",
            )).append("aged"),
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
