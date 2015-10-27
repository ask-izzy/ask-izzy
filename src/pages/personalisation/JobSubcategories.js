/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { remove, append } from "./BaseQuestion";

export default class JobSubcategories extends BaseMultiQuestion {
    static defaultProps = {
        name: "sub-job",
        question: "Where do you want to start?",
        answers: {
            /* eslint-disable max-len */
            "Job search agencies": remove("employment"). append("job searching"),
            "Programs to help you into paid work": append("programmes"),
            "Volunteering": remove("employment").append("volunteering"),
        },
    };
}
