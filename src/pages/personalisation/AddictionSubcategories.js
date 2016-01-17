/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append, remove } from "./BaseQuestion";

export default class AddictionSubcategories extends BaseMultiQuestion {
    static title = "Drugs & Alcohol";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-addiction",
        question: "What sort of help?",
        answers: {
            "Rehab": append("rehabilitation"),
            "Drugs": remove("substance abuse").append("drugs"),
            "Alcohol": remove("substance abuse").append("alcohol"),
            "Needle exchange": remove("substance abuse")
                .append("needle exchange"),
            "Speak to someone": append("counselling"),
        },
    };
}
