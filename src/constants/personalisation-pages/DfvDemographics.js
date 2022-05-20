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
        "Aboriginal and/or Torres Strait Islander": icons.DemographicAtsi,
        "Experiencing violence": icons.ExperiencingViolence,
        "Under 18": icons.Under18,
        "LGBTIQA+": icons.DemographicLgbtiq,
        "Culturally and linguistically diverse":
            icons.DemographicNeedInterpreter,
        "Person seeking asylum": icons.DemographicRecentlyArrived,
        "Using violence": icons.UsingViolence,
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
        case "Culturally and linguistically diverse":
            return "Culturally & linguistically diverse";
        case "Person seeking asylum":
            return "Seeking asylum";
        default:
            return answer;
        }
    },
}: PersonalisationPage)
