/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";

export default class JobSubcategories extends BaseQuestion {
    static title = "Jobs";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-job",
        question: "Where do you want to start?",
        mandatory: true,
        answers: {
            /* eslint-disable max-len */
            "Employment support": 
                append("career work -(coordinating bodies) -(job active) -disability")
                .append({catchment: "prefer"}),
            "Training and skills": append("training -(coordinating bodies)")
                .append({catchment: "prefer"}),
            "Volunteering opportunities": append("volunteering -(coordinating bodies)")
                .append({catchment: "prefer"}),
        },
    };
}
