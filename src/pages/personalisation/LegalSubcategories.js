/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

export default class LegalSubcategories extends BaseMultiQuestion {
    static defaultProps = {
        name: "sub-legal",
        question: "What's happening?",
        answers: [
            "Fines",
            "Criminal charges",
            "Driving charges",
            "Victims of crime compensation",
            "Family violence",
            "Debts",
            "Tenancy issues",
        ],
    };
}
