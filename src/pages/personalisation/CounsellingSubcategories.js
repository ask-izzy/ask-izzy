/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append } from "./BaseQuestion";

export default class CounsellingSubcategories extends BaseMultiQuestion {
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-counselling",
        question: "What issues are you dealing with?",
        answers: {
            "Homelessness": append("homeless"),
            "Family violence": append("family violence"),
            "Sexual identity": append("sexuality"),
            "Asylum seeker or refugee": append("refugee"),
            "Family or relationships": append("relationship"),
            "Money matters": append("financial"),
            "Online": append("online"),
        },
    };
}
