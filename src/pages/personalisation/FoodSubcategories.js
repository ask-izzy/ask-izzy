/* @flow */
import BaseQuestion from "./BaseQuestion";
/* eslint-disable no-unused-vars */
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"


// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-food",
    question: "What type of food do you need?",
    possibleAnswers: {
        "Meals": {
            serviceTypes: ["Meals"],
        },
        "Food parcels / groceries": {
            serviceTypes: ["Meals"],
        },
        "Food vouchers": {
            serviceTypes: ["Meals"],
        },
    },
    descriptionsForAnswers: {
        "Meals": "Free warm meals.",
        "Food parcels / groceries": "Fresh food and pantry items.",
        "Food vouchers": "To spend at the supermarket.",
    },
    showSupportSearchBar: true,
};

export default class FoodSubcategories extends BaseQuestion {
    static title: string = "Services";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Food packages/parcels/vouchers":
            return "Parcels/vouchers";
        default:
            return answer
        }
    }
}
