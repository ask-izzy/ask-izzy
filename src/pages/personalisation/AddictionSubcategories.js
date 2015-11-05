/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { remove, append } from "./BaseQuestion";

export default class AddictionSubcategories extends BaseMultiQuestion {
    static defaultProps = {
        name: "sub-addiction",
        question: "What sort of help?",
        answers: {
            "Detox": remove("gambling").append("detox"),
            "Rehab": remove("gambling").append("rehab"),
            "Gambling": remove("substance abuse"),
            "Drugs or Alcohol": remove("gambling").append("drugs alcohol"),
            "Needle exchange": remove("substance abuse gambling")
                .append("needle exchange"),
            "Speak to someone": append("counselling"),
        },
    };
}
