/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append } from "./BaseQuestion";
import AdvocacySubcategories from "./AdvocacySubcategories";

export default class ComplaintSubcategories extends BaseMultiQuestion {
    static title = "Complaints & Advocacy";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-advocacy-complaints",
        question: "What's not working?",
        answers: {
            "Housing": append("Housing"),
            "Legal": append("Legal"),
            "Health": append("Health"),
            "Disability": append("Disability"),
            "Finance": append("Financial ombudsman"),
            "Public Transport": append("Public Transport"),
            "Other": append(""),
        },
    };

    static showQuestion() {
        /* only show this question if the user is making a complaint */
        return (
            AdvocacySubcategories.answer &&
            AdvocacySubcategories.answer.includes(
                "Making a complaint"
            )
        );
    }

}
