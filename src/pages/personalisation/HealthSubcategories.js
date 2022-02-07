/* @flow */
import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/ServiceSearchRequest";
import { resetDfvOptions } from "../../utils/domesticViolence";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

function specialist(query) {
    return remove("(community health)").append(query);
}

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-health",
    question: "What sort of help do you need?",
    possibleAnswers: {
        "Doctor": remove("(community health)")
            .append("(general medical practitioners)"),
        "Nurse": append("nurse"),
        "Social & emotional wellbeing": specialist("(mental health)"),
        "Domestic & family violence": append("health (Family violence)")
            .remove("(community health)"),
        "Sexual assault": append("(sexual assault)")
            .remove("(community health)"),
        "Sexual health": specialist("(sexual health)"),
        "Dentist": specialist("dentistry"),
        "Problems with feet": specialist("podiatry"),
        "Eye care": specialist("optometry"),
        "Children": remove("(community health)")
            .append("health children"),
        "Maternal & child health": remove("(community health)")
            .remove({show_in_askizzy_health: true})
            .append("(maternal child health)"),
        "Hospital": remove("(community health)")
            .remove({show_in_askizzy_health: true})
            .append("(public hospital services)")
            .append("-pac")
            .append("-medicare"),
    },
    showSupportSearchBar: true,
};

export default class HealthSubcategories extends BaseQuestion {
    static title: string = "Health";
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
        case "Social & emotional wellbeing":
            return "Mental health";
        case "Problems with feet":
            return "Podiatry";
        case "Domestic & family violence":
            return "Domestic & family violence help";
        case "Sexual assault":
            return "Sexual assault support";
        case "Children":
            return "For children";
        case "Hospital":
            return "Hospitals";
        default:
            return answer
        }
    }
}
