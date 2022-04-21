/* @flow */
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

import BaseQuestion from "./BaseQuestion";

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-addiction",
    question: "What sort of help?",
    possibleAnswers: {
        "Rehab": {
            $concat: {
                term: [
                    "rehabilitation",
                ],
            },
        },
        "Drugs": {
            $concat: {
                term: [
                    "drugs",
                ],
            },
            $removeElms: {
                term: [
                    "substance",
                    "abuse",
                ],
            },
        },
        "Alcohol": {
            $concat: {
                term: [
                    "alcohol",
                ],
            },
            $removeElms: {
                term: [
                    "substance",
                    "abuse",
                ],
            },
        },
        "Needle exchange": {
            $concat: {
                term: [
                    "needle",
                    "exchange",
                ],
            },
            $removeElms: {
                term: [
                    "substance",
                    "abuse",
                ],
            },
        },
        "Speak to someone": {
            $concat: {
                term: [
                    "counselling",
                ],
            },
        },
    },
    showSupportSearchBar: true,
}

export default class AddictionSubcategories extends BaseQuestion {
    static title: string = "Drugs & alcohol";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Speak to someone":
            return "Counselling";
        default:
            return answer
        }
    }
}
