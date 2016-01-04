/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append, remove } from "./BaseQuestion";

export default class CounsellingSubcategories extends BaseMultiQuestion {
    static title = "Counselling";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-counselling",
        question: "What issues are you dealing with?",
        answers: {
            "Homelessness": append("homeless"),
            "Family violence": append("family violence"),
            "Sexual identity": append("sexuality"),
            "Family or relationships": append("family relationship"),
            "Money matters": append("money matters"),
            "Gambling": append("gambling"),
            "Find online counselling": remove("support")
                .append("online"),
            "Other": append(""),
        },
    };
}
