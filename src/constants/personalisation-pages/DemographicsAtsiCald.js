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
    name: "demographics-atsi-cald",
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
        "Have cultural needs and don't speak English": {
            $concat: {
                term: ["ethnic"],
            },
        },
    },
    icons: {
        "Aboriginal and/or Torres Strait Islander": icons.DemographicAtsi,
        "Have cultural needs and don't speak English":
            icons.DemographicNeedInterpreter,
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
    getShouldShowInSummary(category) {
        return this.getShouldIncludePage(category)
    },
    getShouldIncludePage: (category) => {
        if (category?.key === "health") {
            return ["Children's health", "Doctor or general practitioner"]
                .includes(getSavedPersonalisationAnswer(HealthSubcategories))
        } else if (category?.key === "support-and-counselling") {
            return ["Gambling counselling"]
                .includes(getSavedPersonalisationAnswer(CounsellingSubcategories))
        }
        return false
    },
}: PersonalisationPage)
