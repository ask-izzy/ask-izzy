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
            serviceTypes: ["General Practitioners"],
        },
        "Mental and emotional health": {
            serviceTypes: ["Mental Health"],
        },
        "Dentist": {
            serviceTypes: ["Dentists/Oral Health Professionals"],
        },
        "Children's health": {
            serviceTypes: ["Children's health services"],
        },
        "Problems with feet": {
            serviceTypes: [
                "Podiatrists",
                "Paediatricians & Neonatologists",
                "Paediatric Dentists",
            ],
        },
        "Hospital": {
            serviceTypes: [
                "Hospital",
            ],
        },
        "Alcohol and other drugs": {
            serviceTypes: ["Alcohol & Other Drugs"],
        },
    },
    descriptionsForAnswers: {
        "Doctor": "Someone to talk to about any health problem.",
        "Mental and emotional health":
            "Help with anxiety, depression and mental health.",
        "Dentist": "Help with teeth and mouth health.",
        "Children's health": "Paediatricians and help for kids.",
        "Problems with feet": "Podiatrists for help with foot problems.",
        "Hospital": "Emergency rooms for urgent problems.",
        "Alcohol and other drugs": "Rehab, detox, managing withdrawals.",
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
