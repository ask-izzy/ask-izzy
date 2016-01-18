/* @flow */

import BaseQuestion, { append, remove } from "./BaseQuestion";

export default class CounsellingSubcategories extends BaseQuestion {
    static title = "Counselling";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-counselling",
        question: "What issues are you dealing with?",
        answers: {
            "Homelessness": append("homeless"),
            "Family violence": remove("support")
                .append("family violence"),
            "Sexual identity": append("sexuality"),
            "Family or relationships": remove("support")
                .append("family relationship"),
            "Money matters": remove("support counselling")
                .append("(money matters)"),
            "Gambling": remove("support")
                .append("gambling"),
            "Find online counselling": remove("support")
                .append("online"),
            "Other": append(""),
        },
    };
}
