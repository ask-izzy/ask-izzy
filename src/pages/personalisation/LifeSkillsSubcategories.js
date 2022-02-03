/* @flow */
import BaseQuestion from "./BaseQuestion";
import { remove } from "../../iss/ServiceSearchRequest";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
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

export default class LifeSkillsSubcategories extends BaseQuestion {
    static title: string = "Life skills";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "School":
            return "Schools";
        default:
            return answer
        }
    }
}
