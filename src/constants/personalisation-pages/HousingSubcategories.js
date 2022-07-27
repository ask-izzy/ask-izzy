/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"
import SleepTonight from "./SleepTonight";
import {housingCrisisSearchQueryChanges} from "../../utils/housing-crisis";
import {
    getSavedPersonalisationAnswer,
} from "../../utils/personalisation"

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
}: PersonalisationPage)