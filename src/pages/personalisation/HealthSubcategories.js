/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";
import { resetDfvOptions } from "../../utils/domesticViolence";

export default class HealthSubcategories extends BaseQuestion {
    static title: string = "Mental Health";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "sub-health",
        question: "What sort of support do you need?",
        mandatory: true,
        answers: {
            "I want to find someone to talk to right now":
                append(
                    "(mental health) helpline lifeline " +
                    "-(coordinating bodies)"
                ).append({catchment: "prefer"}),
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

    static breadcrumbAnswer(): string {
        switch (this.answer) {
        case "Social & emotional wellbeing":
            return "Mental health";
        case "Problems with feet":
            return "Podiatry";
        case "Domestic & family violence":
            return "Domestic & family violence help";
        case "Sexual assault":
            return "Sexual assault support";
        case "Children":
            return "For children";
        case "Hospital":
            return "Hospitals";
        default:
            return this.answer
        }
    }
}
