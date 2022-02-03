/* @flow */
import BaseQuestion from "./BaseQuestion";
import { remove } from "../../iss/ServiceSearchRequest";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-advocacy",
    question: "What do you want help with or advice about?",
    possibleAnswers: {
        "Making a complaint":
            remove("consumer issues mediation discrimination")
                .remove("disputes advocacy")
                .append("ombudsman complaint"),
        "Get advice on your rights":
            remove("consumer issues mediation discrimination")
                .remove("disputes advocacy")
                .append("rights advice"),
        "Someone to speak for you":
            remove("consumer issues mediation discrimination")
                .remove("disputes advocacy")
                .append("advocacy"),
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
