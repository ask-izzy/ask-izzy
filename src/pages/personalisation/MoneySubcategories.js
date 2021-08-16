/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";

export default class MoneySubcategories extends BaseQuestion {
    static title: string = "Money services";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "sub-money",
        question: "What do you need?",
        answers: {
            /* eslint-disable max-len */
            "Emergency aid": append("emergency aid"),
            "Bond or rental assistance": append("(bond assistance)"),
            "Financial assistance e.g. utility bills, petrol, food":
                append({ service_type: ["financial aid"] }),
            "No interest & low interest loans": remove("financial aid")
                .append("nils")
                .append("low-interest"),
            "Gambling counselling": remove("financial aid")
                .append("gambling counselling"),
            "Financial counselling": remove("financial aid")
                .append("financial counselling")
                .append("name:\"financial counselling\""),
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
