/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append, remove } from "./BaseQuestion";

export default class MoneySubcategories extends BaseMultiQuestion {
    static title = "Money help";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-money",
        question: "What do you need?",
        answers: {
            /* eslint-disable max-len */
            "Emergency aid": append("emergency aid"),
            "Bond or rental assistance": append("bond assistance"),
            "Financial assistance e.g. utility bills": "",
            "No interest loans": append("nils"),
            "Gambling counselling": remove("financial aid").append("gambling counselling"),
            "Financial counselling": remove("aid").append("counselling name:financial counselling"),
        },
    };
}
