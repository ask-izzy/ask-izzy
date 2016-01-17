/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { remove } from "./BaseQuestion";

export default class JobSubcategories extends BaseMultiQuestion {
    static title = "Jobs";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-job",
        question: "Where do you want to start?",
        answers: {
            /* eslint-disable max-len */
            "Employment": remove("employment")
                .append("job searching"),
            "Volunteering": remove("employment")
                .remove({service_type: "employment"})
                .append("volunteering"),
        },
    };
}
