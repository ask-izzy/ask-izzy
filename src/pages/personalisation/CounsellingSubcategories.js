/* @flow */
import React from "react";
import type {
    Node as ReactNode,
} from "react"

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/ServiceSearchRequest";
import { resetDfvOptions } from "../../utils/domesticViolence";
import icons from "../../icons";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-counselling",
    question: "What issues are you dealing with?",
    possibleAnswers: {
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
    showSupportSearchBar: true,
};

export default class CounsellingSubcategories extends BaseQuestion {
    static title: string = "Counselling services";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    componentDidMount(): void {
        if (super.componentDidMount) {
            super.componentDidMount();
        }

        resetDfvOptions();
    }

    static prettyPrintAnswer(answer: string): ReactNode {
        switch (answer) {
        case "Sexual identity (LGBTIQA+)":
            return <icons.DemographicLgbtiq />;
        case "Scared in my relationship":
            return "Family or domestic violence";
        case "Find online counselling":
            return "Online counselling";
        default:
            return answer
        }
    }
}
