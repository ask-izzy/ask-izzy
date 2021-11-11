/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
import { remove } from "../../iss/ServiceSearchRequest";

export default class JobSubcategories extends BaseQuestion {
    static title: string = "Jobs";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "sub-job",
        question: "Where do you want to start?",
        possibleAnswers: {
            /* eslint-disable max-len */
            "Employment": remove("employment")
                .append("job searching"),
            "Volunteering": remove("employment")
                .remove({service_type: ["employment"]})
                .append("volunteering"),
        },
    };
}
