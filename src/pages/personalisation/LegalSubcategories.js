/* @flow */
import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/ServiceSearchRequest";
import { resetDfvOptions } from "../../utils/domesticViolence";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-legal",
    question: "What's happening?",
    possibleAnswers: {
        "Police and liaison officers": append("police (police liaison)")
            .remove("(legal aid)"),
        "Legal advice": remove("legal -permits -ceremonies")
            .remove("-making -checks -electoral -taxation")
            .remove("-centrelink -immigration -(hire of facilities)")
            .remove("(legal aid)").append("legal advice"),
        "Domestic & family violence issues":
            append("(family violence) -police").remove("(legal aid)"),
        "Victims of crime compensation": remove("legal -permits")
            .remove("-(coordinating bodies) -ceremonies -making")
            .remove("-checks -electoral -taxation")
            .remove("-centrelink -immigration -(hire of facilities)")
            .remove("(legal aid)").append("victims of crime -police"),
    },
    showSupportSearchBar: true,
};

export default class LegalSubcategories extends BaseQuestion {
    static title: string = "Legal";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    componentDidMount(): void {
        if (super.componentDidMount) {
            super.componentDidMount();
        }

        resetDfvOptions();
    }

    static prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Police and liaison officers":
            return "Police & liaison officers";
        case "Domestic & family violence issues":
            return "Domestic & family violence";
        case "Victims of crime compensation":
            return "Victims of crime";
        default:
            return answer
        }
    }
}
