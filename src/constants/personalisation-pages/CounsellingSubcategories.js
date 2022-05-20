/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"
import React from "react";
import type {Node as ReactNode} from "react";
import DemographicLgbtiqIcon from "../../icons/DemographicLgbtiq";

export default ({
    type: "question",
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
    title: "Counselling services",
    resetDfvOptionsOnDisplay: true,
    prettyPrintAnswer(answer: string): string | ReactNode {
        switch (answer) {
        case "Sexual identity (LGBTIQA+)":
            return <DemographicLgbtiqIcon />;
        case "Scared in my relationship":
            return "Family or domestic violence";
        case "Find online counselling":
            return "Online counselling";
        default:
            return answer
        }
    },
}: PersonalisationPage)
