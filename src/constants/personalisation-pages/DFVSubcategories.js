/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"
import icons from "../../icons";

export default ({
    type: "question",
    name: "dfv-help-subcategory",
    question: "What best describes what you need?",
    info: "All of your answers are private and anonymous.",
    possibleAnswers: {
        "Counselling and support": {
            serviceTypes: ["Domestic violence counselling"],
            $concat: {
                term: [
                    "counselling",
                ],
            },
        },
        "Police": {
            serviceTypes: ["Law enforcement/ Police"],
            $concat: {
                term: [
                    "police",
                    "dvlo",
                ],
            },
            $removeElms: {
                term: [
                    "\"family violence\"",
                ],
            },
        },
        "Legal support": {
            $concat: {
                term: [
                    "legal",
                    "-permits",
                    "-ceremonies",
                    "-making",
                    "-checks",
                    "-electoral",
                    "-taxation",
                    "-centrelink",
                    "-immigration",
                    "-\"hire of facilities\"",
                    "-police",
                ],
            },
        },
        "Children's support and protection": {
            $concat: {
                term: [
                    "Child Protection/ Placement",
                ],
            },
            $removeElms: {
                term: [
                    "\"family violence\"",
                ],
            },
        },
        "Sexual assault support": {
            serviceTypes: [
                "Sexual Assault Services",
                "Incest/sexual abuse counselling",
            ],
            $concat: {
                term: [
                    "\"sexual assault\"",
                ],
            },
            $removeElms: {
                term: [
                    "\"family violence\"",
                ],
            },
        },
        "Help for people using violence": {
            $concat: {
                term: [
                    "\"men's behaviour change\"",
                ],
            },
            $removeElms: {
                term: [
                    "\"family violence\"",
                ],
            },
        },
        "Emergency accommodation": {
            serviceTypes: [
                "Refuge/ Crisis accommodation",
                "Emergency financial assistance for accommodation",
            ],
            $concat: {
                term: [
                    "crisis accommodation",
                ],
            },
        },
        "Help with pets": {
            $concat: {
                term: [
                    "pets",
                    "-\"animal control\"",
                    "-\"effectiveness training\"",
                ],
            },
        },
    },
    icons: {
        "Counselling and support": icons.Support,
        "Police": icons.Police,
        "Legal support": icons.Legal,
        "Children's support and protection": icons.DemographicChildren,
        "Sexual assault support": icons.SexualViolence,
        "Help for people using violence": icons.UsingViolence,
        "Emergency accommodation": icons.House,
        "Help with pets": icons.DemographicPets,
    },
    descriptionsForAnswers: {
        "Counselling and support": "Someone to talk to",
        "Police": "Stations and liason officers",
        "Legal support": "Intervention orders, court and separation",
        "Children's support and protection":
            "Support services and child protection",
        "Sexual assault support": "Counselling, medical care and support",
        "Help for people using violence":
            "Counselling & behaviour change programs",
        "Emergency accommodation": "Need a place to stay",
        "Help with pets": "Shelter or assistance for pets",
    },
    showSupportSearchBar: true,
    title: "Services",
}: PersonalisationPage)
