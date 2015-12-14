/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append } from "./BaseQuestion";

export default class AddictionSubcategories extends BaseMultiQuestion {
    static title = "Addiction";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-addiction",
        question: "What sort of help?",
        answers: {
            "Detox": append("detox"),
            "Rehab": append("rehab"),
            "Gambling": append("gambling"),
            "Drugs or Alcohol": append("drugs alcohol"),
            "Needle exchange": append("needle exchange"),
            "Speak to someone": append("counselling"),
        },
    };
}
