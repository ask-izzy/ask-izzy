/* @flow */

import BaseQuestion, { remove } from "./BaseQuestion";

export default class LifeSkillsSubcategories extends BaseQuestion {
    static title = "Life Skills";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-life-skills",
        question: "Want to develop skills?",
        answers: {
            /* eslint-disable max-len */
            "School": remove("life skills education").append("government schools"),
            "Training with support": remove("life skills education")
                .append("supported vocational training"),
        },
    };
}
