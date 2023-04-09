import React, {ReactNode} from "react";

import type {
    PersonalisationPage,
} from "@/types/personalisation-page.js"
import DemographicLgbtiqIcon from "@/src/icons/DemographicLgbtiq.js";


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
} as PersonalisationPage)
