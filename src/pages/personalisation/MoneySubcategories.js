/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { remove } from "./BaseQuestion";

export default class MoneySubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-money",
        question: "What do you need?",
        answers: {
            /* eslint-disable max-len */
            "Emergency aid": remove("gambling").append("emergencies"),
            "Bond or rental assistance": remove("gambling").append("bond assistance"),
            "Financial assistance e.g. utility bills": remove("gambling").append("financial aid"),
            "No interest loans": remove("gambling").append("nils"),
            "Gambling counselling": remove("finance"),
        },
    };
}
