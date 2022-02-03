/* @flow */
import BaseQuestion from "./BaseQuestion";
/* eslint-disable no-unused-vars */
import { append, remove } from "../../iss/ServiceSearchRequest";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"


// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-food",
    question: "What type of food do you need?",
    possibleAnswers: {
        "Community meals": remove("-(coordinating bodies)"),
        "Food packages/parcels/vouchers": remove("meals")
            .append("(Food Parcels & Food Vouchers)")
            .append({service_type: ["material aid"]}),
        "Meals on Wheels": remove("meals")
            .remove("-(meals on wheels)")
            .remove("-chsp")
            .append("meals on wheels"),
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
