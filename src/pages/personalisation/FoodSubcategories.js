/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
/* eslint-disable no-unused-vars */
import { append, remove } from "../../iss/Search";

export default class FoodSubcategories extends BaseQuestion {
    static title: string = "Services";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "sub-food",
        question: "What type of food do you need?",
        possibleAnswers: {
            "Community meals": remove("-(coordinating bodies)"),
            "Food packages/parcels/vouchers": remove("meals")
                .append("(Food Parcels & Food Vouchers)")
                .append({service_type: ["material aid"]}),
            "Meals on Wheels": remove("meals")
                .remove("-(meals on wheels)")
                .remove("-chsp")
                .append("meals on wheels"),
        },
    };

    static prettyPrintSavedAnswer(): string | Array<string> {
        switch (this.savedAnswer) {
        case "Food packages/parcels/vouchers":
            return "Parcels/vouchers";
        default:
            return this.savedAnswer
        }
    }
}
