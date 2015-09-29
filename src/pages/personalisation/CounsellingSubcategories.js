/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { SearchOnSubcategoryText } from "./mixins";

/*::`*/@SearchOnSubcategoryText/*::`;*/
export default class CounsellingSubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-counselling",
        question: "What issues are you dealing with?",
        answers: [
            "Family violence",
            "Sexual identity",
            "Asylum seeker or refugee",
            "Family or relationships",
            "Disability support",
            "Money matters eg: gambling",
            "Out of prison",
            "Pets & vet care",
        ],
    };

}
