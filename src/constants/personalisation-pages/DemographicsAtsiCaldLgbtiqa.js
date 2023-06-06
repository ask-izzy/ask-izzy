/* @flow */

import icons from "../../icons";
import * as React from "react";
import type {Node as ReactNode} from "react";

import {
    getSavedPersonalisationAnswer,
} from "../../utils/personalisation"
import HealthSubcategories from "./HealthSubcategories";
import CounsellingSubcategories from "./CounsellingSubcategories";
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

export default ({
    type: "question",
    name: "demographics-atsi-cald-lgbtiqa",
    question: "Do you want to see services specific to any of the below?",
    byline: "Identifying these characteristics helps us to find services that can better meet your needs.",
    info: "All of your answers are private and anonymous.",
    multipleChoice: true,
    possibleAnswers: {
        "Aboriginal and/or Torres Strait Islander": {
            $concat: {
                term: ["\"Aboriginals & Torres Strait Islanders\""],
            },
        },
        "Have cultural needs and don't speak English": {
            $concat: {
                term: ["ethnic"],
            },
        },
        "LGBTIQA+": {
            $concat: {
                term: ["sexuality"],
            },
        },
    },
    icons: {
        "Aboriginal and/or Torres Strait Islander": icons.DemographicAtsi,
        "Have cultural needs and don't speak English":
            icons.DemographicNeedInterpreter,
        "LGBTIQA+": icons.DemographicLgbtiq,
    },
    descriptionsForAnswers: {
        "Have cultural needs and don't speak English": "CALD communities, interpreter or translation support.",
    },
    oldAnswers: {
        "Indigenous": "Aboriginal and/or Torres Strait Islander",
        "Aboriginal": "Aboriginal and/or Torres Strait Islander",
    },
    title: "Personal",
    resetDfvOptionsOnDisplay: true,
    summaryLabel: "Do you want to see services specific to the following?",
    prettyPrintAnswer(answer: string): ReactNode {
        switch (answer) {
        case "Aboriginal and/or Torres Strait Islander":
            return <span>
                <icons.AboriginalFlag/>
                <icons.TorresStraitIslandersFlag />
            </span>;
        case "Have cultural needs and don't speak English":
            return "Cultural needs/non-English speaking"
        default:
            return answer;
        }
    },
    get shouldShowInSummary() {
        return this.getShouldIncludePage()
    },
    getShouldIncludePage: () => {
        return Boolean(
            ["Doctor or general practitioner", "Mental and emotional health"].includes(
                getSavedPersonalisationAnswer(HealthSubcategories)
            ) ||
                [
                    "Mental and emotional health",
                    "Family or relationships",
                    "Drugs and alcohol counselling",
                    "Sexual assault or family violence",
                ].includes(getSavedPersonalisationAnswer(CounsellingSubcategories))
        );
    },
}: PersonalisationPage)
