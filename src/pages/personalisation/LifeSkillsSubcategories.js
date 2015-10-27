/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

export default class LifeSkillsSubcategories extends BaseMultiQuestion {
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
