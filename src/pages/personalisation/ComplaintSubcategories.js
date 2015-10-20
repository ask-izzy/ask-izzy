/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append } from "./BaseQuestion";
import AdvocacySubcategories from "./AdvocacySubcategories";

export default class ComplaintSubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-advocacy-complaints",
        question: "What's not working?",
        answers: {
            "Public Housing": append("Public Housing"),
            "Legal": append("Legal"),
            "Health": append("Health"),
            "Disability": append("Disability"),
            "Finance": append("Finance"),
            "Public Transport": append("Public Transport"),
            "Other": append("Other"),
        },
    };

    static showQuestion() {
        /* only show this question if the user is making a complaint */
        return (
            AdvocacySubcategories.answer &&
            AdvocacySubcategories.answer.includes(
                "Do you want to make a complaint?"
            )
        );
    }
}
