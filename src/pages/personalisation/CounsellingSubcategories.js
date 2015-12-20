/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append } from "./BaseQuestion";

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
            "Online": append("online"),
            "Other": append(""),
        },
    };
}
