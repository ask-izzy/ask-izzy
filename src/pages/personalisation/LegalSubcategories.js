/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { SearchOnSubcategoryText } from "./mixins";

/*::`*/@SearchOnSubcategoryText/*::`;*/
export default class LegalSubcategories extends BaseMultiQuestion {
    // flow:disable
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
