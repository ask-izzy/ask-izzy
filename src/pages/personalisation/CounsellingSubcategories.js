/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";

export default class CounsellingSubcategories extends BaseQuestion {
    static title = "Counselling";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-counselling",
        question: "What issues are you dealing with?",
        answers: {
            "Homelessness": append("housing"),
            "Family violence": append("family violence"),
            "Sexual identity": append("sexuality"),
            "Family or relationships": append("family relationship"),
            "Money matters": remove("counselling")
                .append("(money matters)"),
            "Gambling": append("gambling"),
            "Find online counselling": append("online"),
            "Other": append(""),
        },
    };
}
