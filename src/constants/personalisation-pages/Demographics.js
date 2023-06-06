/* @flow */

import icons from "../../icons";
import * as React from "react";
import type {Node as ReactNode} from "react";

/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

export default ({
    type: "question",
    name: "demographics",
    question: "Do any of these apply to you?",
    byline: "Select all that apply",
    info: "All of your answers are private and anonymous.",
    multipleChoice: true,
    possibleAnswers: {
        "Escaping family violence": {
            $concat: {
                term: ["\"family violence\""],
            },
        },
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
        "Family with children": {
            $concat: {
                term: ["families", "-srs"],
            },
        },
        "Couples": {
            $concat: {
                term: ["couples"],
            },
        },
        "Mental or emotional difficulties": {
            $concat: {
                term: ["\"mental health\""],
            },
        },
        "Parole / recently released": {
            $concat: {
                term: ["post-release"],
            },
        },
        "Have a disability": {
            $concat: {
                term: ["disabilities"],
            },
        },
        "Veteran": {
            $concat: {
                term: ["veteran"],
            },
        },
        "Person seeking asylum": {
            $concat: {
                term: ["refugees"],
            },
        },
    },
    icons: {
        "Escaping family violence": icons.DemographicFamilyViolence,
        "Aboriginal and/or Torres Strait Islander": icons.DemographicAtsi,
        "Have cultural needs and don't speak English":
            icons.DemographicNeedInterpreter,
        "Family with children": icons.DemographicChildren,
        "Couples": icons.DemographicCouple,
        "Mental or emotional difficulties": icons.Mental,
        "Parole / recently released": icons.DemographicParole,
        "Have a disability": icons.DemographicDisability,
        "Veteran": icons.DemographicVeteran,
        "Person seeking asylum": icons.DemographicRecentlyArrived,
        "Have pets": icons.DemographicPets,
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
    prettyPrintAnswer(answer: string): ReactNode {
        switch (answer) {
        case "Aboriginal and/or Torres Strait Islander":
            return <span>
                <icons.AboriginalFlag/>
                <icons.TorresStraitIslandersFlag />
            </span>;
        case "Have cultural needs and don't speak English":
            return "Cultural needs/non-English speaking"
        case "Person seeking asylum":
            return "Seeking asylum"
        case "Parole / recently released":
            return "On parole"
        case "Have a disability":
            return "With disability"
        case "Have pets":
            return "Help with pets"
        case "Family with children":
            return "Families"
        case "Escaping family violence":
            return "Escaping violence"
        default:
            return answer;
        }
    },
}: PersonalisationPage)
