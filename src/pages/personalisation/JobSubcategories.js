/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

export default class JobSubcategories extends BaseMultiQuestion {
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
