/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append } from "./BaseQuestion";

export default class LegalSubcategories extends BaseMultiQuestion {
    static defaultProps = {
        name: "sub-legal",
        question: "What's happening?",
        answers: {
            "Fines": append("fines"),
            "Criminal charges": append("criminal charge criminal law"),
            "Driving charges": append("driving charges"),
            "Victims of crime compensation": append("victims of crime"),
            "Family violence": append("family violence"),
            "Debts": append("debts"),
            "Tenancy issues": append("tenancy law"),
        },
    };
}
