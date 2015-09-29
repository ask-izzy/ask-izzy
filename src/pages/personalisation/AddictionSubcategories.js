/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { SearchOnSubcategoryText } from "./mixins";

/*::`*/@SearchOnSubcategoryText/*::`;*/
export default class AddictionSubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-addiction",
        question: "What sort of help?",
        answers: [
            "Detox",
            "Rehab",
            "Needle exchange",
        ],
    };

}
