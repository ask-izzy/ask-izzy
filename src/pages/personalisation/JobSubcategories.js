/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { remove, append } from "./BaseQuestion";

export default class JobSubcategories extends BaseMultiQuestion {
    static title = "Jobs";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-job",
        question: "Where do you want to start?",
        answers: {
            /* eslint-disable max-len */
            "Employment": remove("employment"). append("job searching"),
            "Programs to help you into paid work": remove("employment service_type:employment")
            .append("(work skills) (vocational training) (employment program)"),
            "Volunteering": remove("employment service_type:employment").append("volunteering"),
        },
    };
}
