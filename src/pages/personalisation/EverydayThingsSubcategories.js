/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append } from "./BaseQuestion";

export default class EverydayThingsSubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-everyday-things",
        question: "What things do you need?",
        answers: {
            /* eslint-disable max-len */
            "Food packages/parcels/vouchers": append("food parcel voucher pack"),
            "Transport": append("transport"),
            "Keeping warm e.g. swags": append("swags blankets"),
            "Clothes": append("clothes"),
            "Showers": append("showers"),
            "Personal products": append("toiletries sanitary products"),
            "Laundry": append("laundry facilities washing drying"),
            "Household goods": append("household goods"),
            "Storage lockers": append("storage lockers"),
            "Mail": append("mail"),
            "Help with pets": append("pets"),
        },
    };
}
