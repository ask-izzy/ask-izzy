/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append, remove } from "./BaseQuestion";

export default class EverydayThingsSubcategories extends BaseMultiQuestion {
    static title = "Everyday things";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-everyday-things",
        question: "What do you need?",
        answers: {
            /* eslint-disable max-len */
            "Food packages/parcels/vouchers": append("food parcel voucher pack"),
            "Transport": append("transport voucher taxi subsidy"),
            "Keeping warm": append("swags blankets"),
            "Clothes": append("clothes"),
            "Showers": append("showers"),
            "Personal products": append("toiletries sanitary products"),
            "Laundry": append("laundry facilities washing drying"),
            "Household goods": append("household goods"),
            "Storage lockers": remove("material aid").append("storage lockers"),
            "Mail": append("mail service"),
            "Help with pets": remove("material aid").append("assistance pets -(animal control)"),
        },
    };
}
