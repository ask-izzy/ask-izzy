/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { remove } from "./BaseQuestion";

export default class LifeSkillsSubcategories extends BaseMultiQuestion {
    static title = "Life Skills";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-life-skills",
        question: "Want to develop skills?",
        answers: {
            /* eslint-disable max-len */
            "Daily living": remove("life skills education").append("daily living skills"),
            "Personal": remove("life skills education").append("personal development")
                .append("-vcal -grants"),
            "School": remove("life skills education").append("government schools"),
            "Training with support": remove("life skills education")
                .append("supported vocational training"),
        },
    };
}
