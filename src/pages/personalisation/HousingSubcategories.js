/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import SleepTonight from "./SleepTonight";
import { append } from "./BaseQuestion";

export default class HousingSubcategories extends BaseMultiQuestion {
    static defaultProps = {
        name: "sub-housing",
        question: "Which situation is most like yours?",
        answers: {
            "On the street": append(""),
            "Couch surfing": append(""),
            "In a rooming house": append(""),
            "Private rental": append(""),
            "Public housing": append(""),
            "Mortgaged housing": append(""),
            "Veteran": append(""),
            "Escaping family violence": append(""),
            "Need an interpreter": append(""),
        },
    };

    static showQuestion() {
        /* only show this question if the user has someone to sleep tonight */
        return (SleepTonight.answer == "Yes");
    }
}
