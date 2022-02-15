/* @flow */
import BaseQuestion from "./BaseQuestion";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-advocacy",
    question: "What do you want help with or advice about?",
    possibleAnswers: {
        "Making a complaint": {
            $concat: {
                term: ["ombudsman", "complaint"],
            },
            $removeElms: {
                term: [
                    "consumer",
                    "issues",
                    "mediation",
                    "discrimination",
                    "disputes",
                    "advocacy",
                ],
            },
        },
        "Get advice on your rights": {
            $concat: {
                term: ["rights", "advice"],
            },
            $removeElms: {
                term: [
                    "consumer",
                    "issues",
                    "mediation",
                    "discrimination",
                    "disputes",
                    "advocacy",
                ],
            },
        },
        "Someone to speak for you": {
            $concat: {
                term: ["advocacy"],
            },
            $removeElms: {
                term: [
                    "consumer",
                    "issues",
                    "mediation",
                    "discrimination",
                    "disputes",
                    "advocacy",
                ],
            },
        },
    },
    showSupportSearchBar: true,
};

export default class AdvocacySubcategories extends BaseQuestion {
    static title: string = "Services";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Making a complaint" :
            return "Complaints";
        case "Get advice on your rights" :
            return "Your rights";
        case "Someone to speak for you" :
            return "Representation";
        default:
            return answer
        }
    }
}
