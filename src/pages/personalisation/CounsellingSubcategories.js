/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";
import { resetDfvOptions } from "../../utils/domesticViolence";
import icons from "../../icons";
import * as React from "react";

export default class CounsellingSubcategories extends BaseQuestion {
    static title: any = "Counselling";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: any = {
        name: "sub-counselling",
        question: "What issues are you dealing with?",
        answers: {
            "Homelessness": append("housing"),
            "Scared in my relationship": append("family violence"),
            "Sexual identity (LGBTIQA+)": append("sexuality"),
            "Family or relationships": append("family relationship"),
            "Money matters": remove("counselling")
                .append("(money matters)"),
            "Gambling": append("gambling"),
            "Find online counselling": append("online"),
            "Other": append(""),
        },
    };

    componentDidMount(): void {
        if (super.componentDidMount) {
            super.componentDidMount();
        }

        resetDfvOptions();
    }

    static breadcrumbAnswer(): any {
        switch (this.answer) {
        case "Sexual identity (LGBTIQA+)":
            return <span><icons.DemographicLgbtiq /></span>;
        case "Scared in my relationship":
            return "Family or domestic violence";
        case "Find online counselling":
            return "Online counselling";
        default:
            return this.answer
        }
    }
}
