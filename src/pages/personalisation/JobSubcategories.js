/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { SearchOnSubcategoryText } from "./mixins";

/*::`*/@SearchOnSubcategoryText/*::`;*/
export default class JobSubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-job",
        question: "Where do you want to start?",
        answers: [
            "Job search agencies",
            "Programs to help you into paid work",
            "Volunteering",
        ],
    };

}
