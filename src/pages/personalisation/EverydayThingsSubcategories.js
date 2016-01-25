/* @flow */

import BaseQuestion, { append, remove } from "./BaseQuestion";

export default class EverydayThingsSubcategories extends BaseQuestion {
    static title = "Everyday things";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-everyday-things",
        question: "What do you need?",
        answers: {
            /* eslint-disable max-len */
            "Food packages/parcels/vouchers": append("food parcel voucher pack"),
            "Transport": append("transport voucher petrol taxi travel"),
            "Keeping warm": remove("material aid")
                .append("swags blankets"),
            "Clothes": remove("material aid").append("clothes"),
            "Showers": append("showers"),
            "Personal products":
                append("toiletries sanitary products tampons"),
            "Laundry": append("laundry facilities washing drying"),
            "Household goods": append("household goods"),
            "Help with pets": remove("material aid")
                .remove({service_type: "material aid"})
                .append("assistance pets")
                .append("-(animal control)"),
        },
    };
}
