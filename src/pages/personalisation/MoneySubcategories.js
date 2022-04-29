/* @flow */
import BaseQuestion from "./BaseQuestion";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"


// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-money",
    question: "What do you need?",
    possibleAnswers: {
        /* eslint-disable max-len */
        "Emergency aid": {
            $concat: {
                term: ["emergency", "aid"],
            },
        },
        "Bond or rental assistance": {
            $concat: {
                term: ["\"bond assistance\""],
            },
        },
        "Financial assistance e.g. utility bills, petrol, food": {
            $concat: {
                serviceTypes: ["Financial Aid"],
            },
        },
        "No interest & low interest loans": {
            $concat: {
                term: ["nils", "low-interest"],
            },
            $removeElms: {
                term: ["financial", "aid"],
            },
        },
        "Gambling counselling": {
            $concat: {
                term: ["gambling", "counselling"],
            },
            $removeElms: {
                term: ["financial", "aid"],
            },
        },
        "Financial counselling": {
            $concat: {
                term: [
                    "financial counselling",
                    "name:\"financial counselling\"",
                ],
            },
            $removeElms: {
                term: ["financial", "aid"],
            },
        },
    },
    showSupportSearchBar: true,
};

export default class MoneySubcategories extends BaseQuestion {
    static title: string = "Money services";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Financial assistance e.g. utility bills, petrol, food":
            return "Financial assistance";
        case "No interest & low interest loans":
            return "Money matters";
        case "Gambling counselling":
            return "Gambling";
        case "Financial counselling":
            return "Online counselling";
        default:
            return answer
        }
    }
}
