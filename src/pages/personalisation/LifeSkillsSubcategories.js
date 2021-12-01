/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
import { remove } from "../../iss/ServiceSearchRequest";

export default class LifeSkillsSubcategories extends BaseQuestion {
    static title: string = "Life skills";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "sub-life-skills",
        question: "Want to develop skills?",
        possibleAnswers: {
            /* eslint-disable max-len */
            "School": remove("life skills education").append("government schools"),
            "Training with support": remove("life skills education")
                .append("supported vocational training"),
        },
        showSupportSearchBar: true,
    };

    static prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "School":
            return "Schools";
        default:
            return answer
        }
    }
}
