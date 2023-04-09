import type {
    PersonalisationPage,
} from "@/types/personalisation-page.js"


import SleepTonight from "@/src/constants/personalisation-pages/SleepTonight.js";
import {housingCrisisSearchQueryChanges} from "@/src/utils/housing-crisis.js";
import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation.js"


export default ({
    type: "question",
    name: "sub-housing",
    question: "Which situation is most like yours?",
    possibleAnswers: {
        "On the street": housingCrisisSearchQueryChanges,
        "Couch surfing": {
            $concat: {
                term: [
                    "homeless",
                    "accommodation",
                ],
            },
            $removeElms: {
                term: [
                    "housing",
                ],
            },
        },
        "In a rooming house": {
            $concat: {
                term: [
                    "community",
                    "housing",
                    "-\"rooming house\"",
                ],
            },
            $removeElms: {
                term: [
                    "housing",
                ],
            },
        },
        "Private rental": {
            $concat: {
                term: [
                    "transitional",
                    "accommodation",
                ],
            },
            $removeElms: {
                term: [
                    "housing",
                ],
            },
        },
        "Public housing": {
            $concat: {
                term: [
                    "social",
                    "housing",
                    "-\"public rental\"",
                    "-\"public housing\"",
                ],
            },
            $removeElms: {
                term: [
                    "housing",
                ],
            },
        },
        "Mortgaged housing": {
            $concat: {
                term: [
                    "transitional",
                    "accommodation",
                ],
            },
            $removeElms: {
                term: [
                    "housing",
                ],
            },
        },
    },
    title: "Situation",
    getShouldIncludePage(): boolean {
        /* only show this question if the user has someone to sleep tonight */
        return (getSavedPersonalisationAnswer(SleepTonight) !== "No");
    },
} as PersonalisationPage)
