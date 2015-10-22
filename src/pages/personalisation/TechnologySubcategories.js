/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

export default class TechnologySubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-technology",
        question: "What do you want help with?",
        answers: [
            "Finding wifi",
            "Finding a computer",
            "Help to use a computer",
        ],
    };
}
