/* @flow */
import BaseQuestion from "./BaseQuestion";
import { resetDfvOptions } from "../../utils/domesticViolence";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-health",
    question: "What sort of help do you need?",
    possibleAnswers: {
        "Doctor": {
            $concat: {
                term: ["\"general medical practitioners\""],
            },
            $removeElms: {
                term: ["\"community health\""],
            },
        },
        "Nurse": {
            $concat: {
                term: ["nurse"],
            },
        },
        "Social & emotional wellbeing": {
            $concat: {
                term: ["\"mental health\""],
            },
            $removeElms: {
                term: ["\"community health\""],
            },
        },
        "Domestic & family violence": {
            $concat: {
                term: ["health", "\"Family violence\""],
            },
            $removeElms: {
                term: ["\"community health\""],
            },
        },
        "Sexual assault": {
            $concat: {
                term: ["\"sexual assault\""],
            },
            $removeElms: {
                term: ["\"community health\""],
            },
        },
        "Sexual health": {
            $concat: {
                term: ["\"sexual health\""],
            },
            $removeElms: {
                term: ["\"community health\""],
            },
        },
        "Dentist": {
            $concat: {
                term: ["dentistry"],
            },
            $removeElms: {
                term: ["\"community health\""],
            },
        },
        "Problems with feet": {
            $concat: {
                term: ["podiatry"],
            },
            $removeElms: {
                term: ["\"community health\""],
            },
        },
        "Eye care": {
            $concat: {
                term: ["optometry"],
            },
            $removeElms: {
                term: ["\"community health\""],
            },
        },
        "Children": {
            $concat: {
                term: ["health", "children"],
            },
            $removeElms: {
                term: ["\"community health\""],
            },
        },
        "Maternal & child health": {
            $concat: {
                term: ["\"maternal child health\""],
            },
            $removeElms: {
                term: ["\"community health\""],
            },
            $unset: ["showInAskIzzyHealth"],
        },
        "Hospital": {
            $concat: {
                term: ["\"public hospital services\"", "-pac", "-medicare"],
            },
            $removeElms: {
                term: ["\"community health\""],
            },
            $unset: ["showInAskIzzyHealth"],
        },
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
