/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

export default class EverydayThingsSubcategories extends BaseMultiQuestion {
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
