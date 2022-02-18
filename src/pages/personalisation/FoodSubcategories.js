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
        "Community meals": {
            $removeElms: {
                term: ["-(coordinating bodies)"],
            },
        },
        "Food packages/parcels/vouchers": {
            $concat: {
                term: ["(Food Parcels & Food Vouchers)"],
                serviceTypes: ["Material Aid"],
            },
            $removeElms: {
                term: ["meals"],
            },
        },
        "Meals on Wheels": {
            $concat: {
                term: ["meals", "on", "wheels"],
            },
            $removeElms: {
                term: ["meals", "-(meals on wheels)", "-chsp"],
            },
        },
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
