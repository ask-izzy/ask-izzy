import React, {ReactNode} from "react";

import DemographicFamilyViolence from "@/src/icons/DemographicFamilyViolence.js";
import DemographicAtsi from "@/src/icons/DemographicAtsi.js";
import DemographicChildren from "@/src/icons/DemographicChildren.js";
import DemographicCouple from "@/src/icons/DemographicCouple.js";
import Mental from "@/src/icons/Mental.js";
import DemographicParole from "@/src/icons/DemographicParole.js";
import DemographicDisability from "@/src/icons/DemographicDisability.js";
import DemographicVeteran from "@/src/icons/DemographicVeteran.js";
import DemographicRecentlyArrived from "@/src/icons/DemographicRecentlyArrived.js";
import DemographicPets from "@/src/icons/DemographicPets.js";
import AboriginalFlag from "@/src/icons/AboriginalFlag.js";
import TorresStraitIslandersFlag from "@/src/icons/TorresStraitIslandersFlag.js";


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
        "Have pets": {
            $concat: {
                term: [
                    "pets",
                    "-effectiveness",
                ],
            },
        },
    },
    icons: {
        "Escaping family violence": DemographicFamilyViolence,
        "Aboriginal and/or Torres Strait Islander": DemographicAtsi,
        "Family with children": DemographicChildren,
        "Couples": DemographicCouple,
        "Mental or emotional difficulties": Mental,
        "Parole / recently released": DemographicParole,
        "Have a disability": DemographicDisability,
        "Veteran": DemographicVeteran,
        "Person seeking asylum": DemographicRecentlyArrived,
        "Have pets": DemographicPets,
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
                <AboriginalFlag/>
                <TorresStraitIslandersFlag />
            </span>;
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
} as any)
