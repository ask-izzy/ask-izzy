/* @flow */
import BaseQuestion from "./BaseQuestion";
import Location from "./Location";
import { append, housingCrisis } from "../../iss/ServiceSearchRequest";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sleep-tonight",
    question: "Do you have somewhere safe to sleep tonight?",
    possibleAnswers: {
        "Yes": append(""),
        "No": housingCrisis(() => Location.shouldInjectAccessPoints()),
    },
};

export default class SleepTonight extends BaseQuestion {
    static title: string = "Sleep tonight";

    static propTypes = BaseQuestion.propTypes;

    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Yes":
            return "Safe tonight";
        case "No" :
            return "Not safe tonight";
        default:
            return answer
        }
    }
}
