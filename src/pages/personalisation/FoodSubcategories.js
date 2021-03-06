/* @flow */

import BaseQuestion from "./BaseQuestion";
/* eslint-disable no-unused-vars */
import { append, remove } from "../../iss/Search";

export default class FoodSubcategories extends BaseQuestion {
    static title = "Food";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-food",
        question: "What type of food do you need?",
        answers: {
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
}
