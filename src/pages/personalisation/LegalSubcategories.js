/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append } from "./BaseQuestion";

export default class LegalSubcategories extends BaseMultiQuestion {
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-legal",
        question: "What's happening?",
        answers: {
            "Legal advice": append("advice"),
            "Family violence": append("family violence"),
            "Tenancy issues": append("tenancy law"),
            "Victims of crime compensation": append("victims of crime"),
            "Criminal charges": append("criminal charge criminal law"),
        },
    };
}
