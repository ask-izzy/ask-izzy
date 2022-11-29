/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"
import SleepTonight from "./SleepTonight";
import {
    getSavedPersonalisationAnswer,
} from "../../utils/personalisation"

export default ({
    type: "question",
    name: "housing-subcategory",
    question: "Which situation is most like yours?",
    possibleAnswers: {
        "Emergency accommodation": {
            serviceTypes: [
                "Refuge/ Crisis accommodation",
            ],
            $removeElms: {
                term: [
                    "housing",
                    "-\"respite care\"",
                    "-\"housing information\"",
                    "-hef",
                ],
            },
            minimumShouldMatch: "30%",
            $applyIfShouldInjectAccessPoints: {
                catchment: "true",
                $push: {
                    serviceTypes: "Homelessness Access Point",
                    term: "\"Homelessness Access Point\"",
                },
            },
        },
        "Homelessness support": {
            serviceTypes: [],
            minimumShouldMatch: "30%",
            $concat: {
                term: ["\"homelessness support\""],
            },
            $removeElms: {
                term: [
                    "housing",
                ],
            },
            $applyIfShouldInjectAccessPoints: {
                catchment: "true",
                $push: {
                    serviceTypes: "Homelessness Access Point",
                    term: "\"Homelessness Access Point\"",
                },
            },
        },
        "Affordable housing": {
            serviceTypes: ["Housing", "Social Housing"],
            minimumShouldMatch: "30%",
        },
        "Bond or rent help": {
            serviceTypes: [
                "Bond Scheme",
                "Housing Establishment Fund",
            ],
            $concat: {
                term: [
                    "\"financial aid\"",
                    "-grants",
                    "-heritage",
                    "\"bond assistance\"",
                ],
            },
            $removeElms: {
                term: [
                    "housing",
                    "-\"respite care\"",
                    "-\"housing information\"",
                    "-hef",
                    "-\"holiday accommodation\"",
                ],
            },
        },
        "Rental disputes": {
            serviceTypes: [
                "Housing/Tenancy Information & Referral",
            ],
            minimumShouldMatch: "30%",
            $concat: {
                term: [
                    "rent",
                    "tenant",
                ],
            },
            $removeElms: {
                term: [
                    "housing",
                ],
            },
        },
        "Support with everyday tasks": {
            serviceTypes: [
                "Daily Living Support",
            ],
            $concat: {
                term: [
                    "\"daily living support\"",
                ],
            },
            $removeElms: {
                term: [
                    "housing",
                ],
            },
        },
        "Supported accommodation and residential care": {
            serviceTypes: [
                "Supported Accommodation",
                "Supported Residential Accommodation",
                "Supported Residential Accommodation/Aged Care",
            ],
            minimumShouldMatch: "30%",
            $concat: {
                term: [
                    "\"supported accommodation\"",
                ],
            },
            $removeElms: {
                term: [
                    "housing",
                ],
            },
        },
    },
    descriptionsForAnswers: {
        "Emergency accommodation": "Need a place to stay.",
        "Homelessness support": "Help for people experiencing homelessness.",
        "Affordable housing": "Rental in government owned houses.",
        "Bond or rent help": "Help with rental payments.",
        "Rental disputes": "Deal with issues while renting.",
        "Support with everyday tasks":
            "Home help with cleaning, food, personal care.",
        "Supported accommodation and residential care":
            "Places to live with people who can help.",
    },
    title: "Situation",
    getShouldIncludePage(): boolean {
        /* only show this question if the user has someone to sleep tonight */
        return (getSavedPersonalisationAnswer(SleepTonight) !== "No");
    },
}: PersonalisationPage)
