/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";

export default class MoneySubcategories extends BaseQuestion {
    static title = "Money help";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-money",
        question: "What do you need?",
        answers: {
            /* eslint-disable max-len */
            "Emergency aid": append("emergency aid"),
            "Bond or rental assistance": append("(bond assistance)"),
            "Financial assistance e.g. utility bills, petrol, food": append(""),
            "No interest loans": remove("financial aid")
                .append("nils"),
            "Gambling counselling": remove("financial aid")
                .append("gambling counselling"),
            "Financial counselling": remove("financial aid")
                .append("financial counselling")
                .append('name:"financial counselling"'),
        },
    };
}
