/* @flow */
import React from "react";
import type {
    Node as ReactNode,
} from "react"

import BaseQuestion from "./BaseQuestion";
import { resetDfvOptions } from "../../utils/domesticViolence";
import icons from "../../icons";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-counselling",
    question: "What issues are you dealing with?",
    possibleAnswers: {
        "Homelessness": {
            $concat: {
                term: ["housing"],
            },
        },
        "Scared in my relationship": {
            $concat: {
                term: ["family", "violence"],
            },
        },
        "Sexual identity (LGBTIQA+)": {
            $concat: {
                term: ["sexuality"],
            },
        },
        "Family or relationships": {
            $concat: {
                term: ["family", "relationship"],
            },
        },
        "Money matters": {
            $concat: {
                term: ["\"money matters\""],
            },
            $removeElms: {
                term: ["counselling"],
            },
        },
        "Gambling": {
            $concat: {
                term: ["gambling"],
            },
        },
        "Find online counselling": {
            $concat: {
                term: ["online"],
            },
        },
        "Other": {},
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
