/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append, remove } from "./BaseQuestion";

export default class AddictionSubcategories extends BaseMultiQuestion {
    static title = "Addiction";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-addiction",
        question: "What sort of help?",
        answers: {
            "Detox": append("detoxification"),
            "Rehab": append("rehabilitation"),
            "Gambling": append("gambling"),
            "Drugs or Alcohol": append("substance abuse"),
            "Needle exchange": remove("addiction").
                append("needle exchange"),
            "Speak to someone": append("counselling"),
        },
    };
}
