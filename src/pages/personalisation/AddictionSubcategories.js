/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { replace, remove } from "./BaseQuestion";

export default class AddictionSubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-addiction",
        question: "What sort of help?",
        answers: {
            "Detox": remove("gambling").append("detox"),
            "Rehab": remove("gambling").append("rehab"),
            "Needle exchange": replace("needle exchange"),
        },
    };
}
