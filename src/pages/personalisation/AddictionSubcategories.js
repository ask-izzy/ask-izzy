/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append, replace, remove } from "./BaseQuestion";

export default class AddictionSubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-addiction",
        question: "What sort of help?",
        answers: {
            "Detox": remove("gambling").chain(append("detox")),
            "Rehab": remove("gambling").chain(append("rehab")),
            "Needle exchange": replace("needle exchange"),
        },
    };
}
