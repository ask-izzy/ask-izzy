/* @flow */
import BaseQuestion from "./BaseQuestion";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "gender",
    question: "Do you identify as…",
    possibleAnswers: {
        "Female": {
            $concat: {
                clientGenders: ["Female", "unspecified"],
            },
        },
        "Male": {
            $concat: {
                clientGenders: ["Male", "unspecified"],
            },
        },
        "Trans and Gender Diverse": {
            $concat: {
                clientGenders: ["Diverse", "unspecified"],
            },
        },
    },
};
export default class Gender extends BaseQuestion {
    static title: string = "Gender";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static get summaryLabel(): string {
        return "How do you identify?";
    }

    static headingValue(): string {
        switch (this.savedAnswer) {
        case "Male":
            return "for men";
        case "Female":
            return "for women";
        default:
            // important to not return "" here because it will
            // be followed by the age string and otherwise would
            // say "42 services aged 26 or younger"
            return "for people";
        }
    }

    static prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Male":
            return "Men";
        case "Female":
            return "Women";
        case "Trans and Gender Diverse":
            return "Trans & Gender Diverse";
        default:
            return answer;
        }
    }
}
