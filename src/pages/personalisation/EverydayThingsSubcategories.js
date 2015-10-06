/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { SearchOnSubcategoryText } from "./mixins";

/*::`*/@SearchOnSubcategoryText/*::`;*/
export default class EverydayThingsSubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-everyday-things",
        question: "What things do you need?",
        answers: [
            "Food packages/parcels/vouchers",
            "Transport",
            "Keeping warm e.g. swags",
            "Clothes",
            "Showers",
            "Personal products",
            "Laundry",
            "Household goods",
            "Storage lockers",
            "Mail",
            "Help with pets",
        ],
    };

}
