/* @flow */

import BaseQuestion from "./BaseQuestion";
import { remove } from "../../iss/Search";

export default class LifeSkillsSubcategories extends BaseQuestion {
    static title: any = "Life Skills";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: any = {
        name: "sub-life-skills",
        question: "Want to develop skills?",
        answers: {
            /* eslint-disable max-len */
            "School": remove("life skills education").append("government schools"),
            "Training with support": remove("life skills education")
                .append("supported vocational training"),
        },
    };

    static breadcrumbAnswer(): string {
        switch (this.answer) {
        case "School":
            return "Schools";
        default:
            return this.answer
        }
    }
}
