/* @flow */

import BaseQuestion from "./BaseQuestion";
/* eslint-disable no-unused-vars */
import { append, remove } from "../../iss/Search";

export default class FoodSubcategories extends BaseQuestion {
    static title = "Food";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-food",
        question: "What do you need help with?",
        answers: {
            "Finding a free meal nearby": remove("-(coordinating bodies)"),
            "Meals on Wheels": remove("meals")
                .remove("-(meals on wheels)")
                .remove("-chsp")
                .append("meals on wheels"),
            "Food packages/parcels/vouchers": remove("meals")
                .append("(Food Parcels & Food Vouchers)")
                .append({service_type: ["material aid"]}),
            
            /* eslint-disable max-len */
            "Food packages/parcels/vouchers":
                append("(Food Parcels & Food Vouchers)")
                    .remove("material aid"),
            "Transport": remove("material aid")
                .remove({service_type: ["material aid"]})
                .append("transport")
                .append("travel")
                .append("-hacc"),
            "Keeping warm": remove("material aid")
                .append("swags blankets"),
            "Clothes": remove("material aid").append("clothes"),
            "Showers": append("showers"),
            "Toiletries":
                append("toiletries sanitary products tampons"),
            "Laundry": append("laundry facilities washing drying"),
            "Household goods": append("household goods"),
            "Help with pets": remove("material aid")
                .remove({service_type: ["material aid"]})
                .append("assistance pets")
                .append("-(animal control)")
                .append("-effectiveness"),
        },
    };
}
