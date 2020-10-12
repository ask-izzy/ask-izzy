/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";

export default class MoneySubcategories extends BaseQuestion {
    static title = "Money help";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-money",
        question: "What kind of support do you need?",
        answers: {
            /* eslint-disable max-len */
            "Centrelink": append("centrelink"),
            "Emergency aid": append("emergency aid"),
            "Bond or rental assistance": append("(bond assistance)"),
            "Financial assistance e.g. utility bills, petrol, food":
                append({ service_type: ["financial aid"] }),
            "No interest & low interest loans": remove("financial aid")
                .append("nils")
                .append("low-interest"),
            "Gambling counselling": remove("financial aid")
                .append("gambling counselling"),
            "Financial counselling": remove("financial aid")
                .append("financial counselling")
                .append("name:\"financial counselling\""),
        },
    };
}
