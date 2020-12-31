/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";
import { resetDfvOptions } from "../../utils/domesticViolence";

export default class HealthSubcategories extends BaseQuestion {
    static title = "Mental Health";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-health",
        question: "What sort of support do you need?",
        mandatory: true,
        answers: {
            "I want to find someone to talk to right now": append(
                "(mental health) helpline lifeline -(coordinating bodies)"
            )
                .append({catchment: "prefer"}),
            "I want to find website or online services that can help me":
                append("counselling online -(coordinating bodies)")
                    .append({catchment: "prefer"}),
            "I just want to see what's available for when I need help":
                append("counselling -(coordinating bodies) -assault"),
        },
    };

    componentDidMount(): void {
        if (super.componentDidMount) {
            super.componentDidMount();
        }

        resetDfvOptions();
    }
}
