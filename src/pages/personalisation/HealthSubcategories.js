/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { SearchOnSubcategoryText } from "./mixins";

/*::`*/@SearchOnSubcategoryText/*::`;*/
export default class HealthSubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-health",
        question: "What sort of help do you need?",
        answers: [
            "Doctor or nurse",
            "Children",
            "Maternal & child health",
            "Sexual stuff",
            "Dentist",
            "Feet",
            "Mental or emotional health eg: depression",
            "Hospital",
        ],
    };

}
