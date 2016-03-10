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
            "Prenatal": append(ageGroups("prenatal")),
            "0 to 5": append(ageGroups(
                "baby",
                "toddler",
                "preschool",
            )),
            "6 to 12": append(ageGroups(
                "schoolage",
            )),
            "13 to 15": append(ageGroups(
                "earlyadolescent",
                "midadolescent",
            )),
            "16 to 17": append(ageGroups(
                "lateadolescent",
            )),
            "18 to 25": append(ageGroups(
                "youngadult",
            )),
            "26 to 40": append(ageGroups(
                "adult",
            )),
            "41 to 55": append(ageGroups(
                "middleageadult",
            )),
            "56 to 65": append(ageGroups(
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
