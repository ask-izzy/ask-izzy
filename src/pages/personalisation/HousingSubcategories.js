/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import SleepTonight from "./SleepTonight";
import { SearchOnSubcategoryText } from "./mixins";

/*::`*/@SearchOnSubcategoryText/*::`;*/
export default class HousingSubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-housing",
        question: "Which situation is most like yours?",
        answers: [
            "On the street",
            "Couch surfing",
            "In a rooming house",
            "Private rental",
            "Public housing",
            "Mortgaged housing",
        ],
    };

    static showQuestion() {
        /* only show this question if the user has someone to sleep tonight */
        return (SleepTonight.answer == "Yes");
    }
}
