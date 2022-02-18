/* @flow */
import BaseQuestion from "./BaseQuestion";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-life-skills",
    question: "Want to develop skills?",
    possibleAnswers: {
        /* eslint-disable max-len */
        "School": {
            $concat: {
                term: ["government", "schools"],
            },
            $removeElms: {
                term: ["life", "skills", "education"],
            },
        },
        "Training with support": {
            $concat: {
                term: ["supported", "vocational", "training"],
            },
            $removeElms: {
                term: ["life", "skills", "education"],
            },
        },
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
