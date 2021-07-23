/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

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
    static title: string = "Age";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "age",
        question: "How old are you?",
        answers: {
            "0 to 17": append(ageGroups(
                "prenatal",
                "baby",
                "toddler",
                "preschool",
                "schoolage",
                "earlyadolescent",
                "midadolescent",
                "lateadolescent"
            )).append("children").append("youth"),
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
        if (!this.answer || (this.answer === "(skipped)")) {
            return "";
        } else {
            return `aged ${this.answer}`;
        }
    }

    static breadcrumbAnswer(): string {
        switch (this.answer) {
        case "0 to 17":
            return "0-17";
        case "18 to 26" :
            return "18-26";
        case "27 to 39":
            return "27-39";
        case "40 to 54" :
            return "40-54";
        case "55 to 64":
            return "55-64";
        case "65 or older" :
            return "65+";
        default:
            return this.answer
        }
    }
}
