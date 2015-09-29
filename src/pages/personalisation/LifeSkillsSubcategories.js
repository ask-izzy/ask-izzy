/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { SearchOnSubcategoryText } from "./mixins";

/*::`*/@SearchOnSubcategoryText/*::`;*/
export default class LifeSkillsSubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-life-skills",
        question: "Want to develop skills?",
        answers: [
            "Daily living",
            "Personal",
            "School",
            "Training with support",
        ],
    };

}
