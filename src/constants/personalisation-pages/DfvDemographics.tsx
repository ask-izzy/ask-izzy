import React, {ReactNode} from "react";

import DemographicAtsi from "@/src/icons/DemographicAtsi";
import ExperiencingViolence from "@/src/icons/ExperiencingViolence";
import Under18 from "@/src/icons/Under18";
import DemographicLgbtiq from "@/src/icons/DemographicLgbtiq";
import DemographicNeedInterpreter from "@/src/icons/DemographicNeedInterpreter";
import DemographicRecentlyArrived from "@/src/icons/DemographicRecentlyArrived";
import UsingViolence from "@/src/icons/UsingViolence";
import AboriginalFlag from "@/src/icons/AboriginalFlag";
import TorresStraitIslandersFlag from "@/src/icons/TorresStraitIslandersFlag";

export default ({
    type: "question",
    name: "dfv-demographics",
    question: "Do any of these apply to you?",
    byline: "Select all that apply",
    info: "All of your answers are private and anonymous.",
    multipleChoice: true,
    possibleAnswers: {
        "Aboriginal and/or Torres Strait Islander": {
            $concat: {
                term: ["\"Aboriginals & Torres Strait Islanders\""],
            },
        },
        "Experiencing violence": {},
        "Under 18": {},
        "LGBTIQA+": {},
        "Culturally and linguistically diverse": {
            $concat: {
                term: ["ethnic"],
            },
        },
        "Person seeking asylum": {
            $concat: {
                term: ["refugees"],
            },
        },
        "Using violence": {},
    },
    icons: {
        "Aboriginal and/or Torres Strait Islander": DemographicAtsi,
        "Experiencing violence": ExperiencingViolence,
        "Under 18": Under18,
        "LGBTIQA+": DemographicLgbtiq,
        "Culturally and linguistically diverse":
            DemographicNeedInterpreter,
        "Person seeking asylum": DemographicRecentlyArrived,
        "Using violence": UsingViolence,
    },
    oldAnswers: {},
    title: "Personal",
    resetOptionsOnDisplay: [
        "under-18-dfv",
        "lgbtiqa-domestic-violence",
        "using-violence",
    ],
    prettyPrintAnswer(answer: string): ReactNode {
        switch (answer) {
        case "Aboriginal and/or Torres Strait Islander":
            return <span>
                <AboriginalFlag/>
                <TorresStraitIslandersFlag />
            </span>;
        case "LGBTIQA+":
            return <span>
                <DemographicLgbtiq viewBox="2 9 59 44" />
            </span>;
        case "Culturally and linguistically diverse":
            return "Culturally & linguistically diverse";
        case "Person seeking asylum":
            return "Seeking asylum";
        default:
            return answer;
        }
    },
} as any)
