/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

export default class MoneySubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-money",
        question: "What do you need?",
        answers: [
            "Emergency aid",
            "Bond or rental assistance",
            "Financial assistance e.g. utility bills",
            "No interest loans",
            "Gambling counselling",
        ],
    };
}
