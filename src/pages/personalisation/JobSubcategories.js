/* @flow */

import BaseQuestion from "./BaseQuestion";
import { remove } from "../../iss/Search";

export default class JobSubcategories extends BaseQuestion {
    static title = "Jobs";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-job",
        question: "Where do you want to start?",
        answers: {
            /* eslint-disable max-len */
            "Employment support": remove("employment")
                .append("job searching"),
            "Training and skills": remove("employment")
                .append("job searching"),
            "Volunteering opportunities": remove("employment")
                .remove({service_type: ["employment"]})
                .append("volunteering"),
        },
    };
}
