/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";

export default class EverydayThingsSubcategories extends BaseQuestion {
    static title = "Everyday things";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-everyday-things",
        question: "What do you need?",
        answers: {
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
            "Personal products":
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

    static breadcrumbAnswer(): string {
        switch (this.answer) {
        case "Keeping warm":
            return "Blankets";
        case "Food packages/parcels/vouchers" :
            return "Food parcels/vouchers";
        default:
            return this.answer
        }
    }
}
