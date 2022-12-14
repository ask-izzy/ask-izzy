import React, {ReactNode} from "react";

import DemographicFamilyViolence from "@/src/icons/DemographicFamilyViolence";
import DemographicAtsi from "@/src/icons/DemographicAtsi";
import DemographicChildren from "@/src/icons/DemographicChildren";
import DemographicCouple from "@/src/icons/DemographicCouple";
import Mental from "@/src/icons/Mental";
import DemographicParole from "@/src/icons/DemographicParole";
import DemographicDisability from "@/src/icons/DemographicDisability";
import DemographicVeteran from "@/src/icons/DemographicVeteran";
import DemographicRecentlyArrived from "@/src/icons/DemographicRecentlyArrived";
import DemographicPets from "@/src/icons/DemographicPets";
import AboriginalFlag from "@/src/icons/AboriginalFlag";
import TorresStraitIslandersFlag from "@/src/icons/TorresStraitIslandersFlag";

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
