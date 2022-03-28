/* @flow */
import BaseQuestion from "./BaseQuestion";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"


// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-money",
    question: "What do you need?",
    possibleAnswers: {
        "Centrelink": {
            serviceTypes: ["Centrelink"],
        },
        "Financial aid": {
            serviceTypes: ["Financial Aid"],
        },
        "No or low interest loans": {
            serviceTypes: ["Low-interest loans"],
        },
        "Financial counselling": {
            serviceTypes: ["Financial Counselling"],
        },
        "Bond or rental assistance": {
            serviceTypes: ["Bond Scheme", "Financial Aid"],
        },
        "Gambling counselling": {
            serviceTypes: ["Gambling Counselling"],
        },
    },
    descriptionsForAnswers: {
        "Centrelink": "Access to government support payments.",
        "Financial aid": "Assistance with paying for food, bills, transport.",
        "No or low interest loans":
            "Loans for people and families on low incomes.",
        "Financial counselling": "Help managing money and debt.",
        "Bond or rental assistance": "Help with rental payments or bond money.",
        "Gambling counselling": "Someone to talk to about gambling.",
    },
    showSupportSearchBar: true,
};

export default class MoneySubcategories extends BaseQuestion {
    static title: string = "Money services";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Financial assistance e.g. utility bills, petrol, food":
            return "Financial assistance";
        case "No interest & low interest loans":
            return "Money matters";
        case "Gambling counselling":
            return "Gambling";
        case "Financial counselling":
            return "Online counselling";
        default:
            return answer
        }
    }
}
