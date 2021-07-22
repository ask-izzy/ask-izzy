/* @flow */

import BaseQuestion from "./BaseQuestion";
import { remove } from "../../iss/Search";

export default class JobSubcategories extends BaseQuestion {
    static title: any = "Jobs";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: any = {
        name: "sub-job",
        question: "Where do you want to start?",
        answers: {
            /* eslint-disable max-len */
            "Employment": remove("employment")
                .append("job searching"),
            "Volunteering": remove("employment")
                .remove({service_type: ["employment"]})
                .append("volunteering"),
        },
    };
}
