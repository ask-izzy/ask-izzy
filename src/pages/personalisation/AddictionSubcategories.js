/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { replace, remove, append } from "./BaseQuestion";

export default class AddictionSubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-addiction",
        question: "What sort of help?",
        answers: {
            "Detox": remove("gambling").append("detox"),
            "Rehab": remove("gambling").append("rehab"),
            "Gambling": remove("substance abuse"),
            "Drugs or Alcohol": remove("gambling").append("drugs alcohol"),
            "Needle exchange": replace("needle exchange"),
            "Speak to someone": append("councelling"),
        },
    };
}
