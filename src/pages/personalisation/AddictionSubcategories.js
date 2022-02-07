/* @flow */
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/ServiceSearchRequest";

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-addiction",
    question: "What sort of help?",
    possibleAnswers: {
        "Rehab": append("rehabilitation"),
        "Drugs": remove("substance abuse").append("drugs"),
        "Alcohol": remove("substance abuse").append("alcohol"),
        "Needle exchange": remove("substance abuse")
            .append("needle exchange"),
        "Speak to someone": append("counselling"),
    },
    showSupportSearchBar: true,
};

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
