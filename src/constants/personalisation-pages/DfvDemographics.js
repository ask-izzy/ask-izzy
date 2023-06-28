/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"
import React from "react";
import type {Node as ReactNode} from "react";
import icons from "../../icons";

export default ({
    type: "question",
    name: "dfv-demographics",
    question: "Do any of these apply to you?",
    byline: "Pick the ones that are most important to you",
    info: "This helps show services that might be a better match. Your answers are private and anonymous.",
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
        "Have cultural needs and don't speak English": {
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
        "Aboriginal and/or Torres Strait Islander": icons.DemographicAtsi,
        "Experiencing violence": icons.ExperiencingViolence,
        "Under 18": icons.Under18,
        "LGBTIQA+": icons.DemographicLgbtiq,
        "Have cultural needs and don't speak English":
            icons.DemographicNeedInterpreter,
        "Person seeking asylum": icons.DemographicRecentlyArrived,
        "Using violence": icons.UsingViolence,
    },
    descriptionsForAnswers: {
        "Have cultural needs and don't speak English": "CALD communities, interpreter or translation support.",
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
                <icons.AboriginalFlag/>
                <icons.TorresStraitIslandersFlag />
            </span>;
        case "LGBTIQA+":
            return <span>
                <icons.DemographicLgbtiq viewBox="2 9 59 44" />
            </span>;
        case "Have cultural needs and don't speak English":
            return "Cultural needs/non-English speaking"
        case "Person seeking asylum":
            return "Seeking asylum";
        default:
            return answer;
        }
    },
}: PersonalisationPage)
