/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";

export default class MoneySubcategories extends BaseQuestion {
    static title: string = "Money services";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "sub-money",
        question: "What kind of support do you need?",
        mandatory: true,
        answers: {
            /* eslint-disable max-len */
            "Centrelink": append("centrelink"),
            "Emergency aid": append("emergency -(coordinating bodies) -grants -heritage"),
            "Bond or rental assistance":
                append(
                    "(bond assistance) rent -(coordinating bodies) -grants -heritage"
                ).append({ catchment: ["prefer"] }),
            "Financial assistance e.g. utility bills, petrol, food":
                append("(financial aid) -(coordinating bodies) -grants -heritage")
                    .append({ service_type: ["financial aid"] }),
            "No interest & low interest loans":
                append("nils low-interest -(coordinating bodies) -grants -heritage"),
            "Gambling counselling":
                append("Gambling -(coordinating bodies) -grants -heritage"),
            "Financial counselling":
                append("financial -(coordinating bodies) -grants -heritage")
                    .append({name: "financial counselling"}),
        },
    };

    static breadcrumbAnswer(): string {
        switch (this.answer) {
        case "Financial assistance e.g. utility bills, petrol, food":
            return "Financial assistance";
        case "No interest & low interest loans":
            return "Money matters";
        case "Gambling counselling":
            return "Gambling";
        case "Financial counselling":
            return "Online counselling";
        default:
            return this.answer
        }
    }
}
