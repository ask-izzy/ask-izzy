/* @flow */
import BaseQuestion from "./BaseQuestion";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-advocacy",
    question: "What do you want help with or advice about?",
    possibleAnswers: {
        "Legal aid and advice": {
            serviceTypes: [
                "Legal Advice",
                "Legal Aid",
                "Legal Information",
                "Legal Representation",
            ],
        },
        "Help with fines": {
            serviceTypes: [],
        },
        "Advocacy": {
            serviceTypes: ["Advocacy"],
        },
        "Disability advocacy": {
            serviceTypes: ["Disability advocacy"],
        },
        "Homelessness support": {
            serviceTypes: [],
        },
        "Rental disputes": {
            serviceTypes: [],
        },
    },
    descriptionsForAnswers: {
        "Legal aid and advice": "Free or affordable support for legal issues.",
        "Help with fines": "Resolve or contest fines.",
        "Advocacy": "Someone to speak for you and fight for your rights.",
        "Disability advocacy":
            "Someone to assist with finding and accessing services.",
        "Homelessness support": "Help for people experiencing homelessness.",
        "Rental disputes": "Deal with issues while renting.",
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
