/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

export default ({
    type: "question",
    name: "support-and-counselling-subcategory",
    question: "What issues are you dealing with?",
    possibleAnswers: {
        "Mental and emotional health": {
            serviceTypesRaw: ["Mental Health"],
            $unset: ["serviceTypes"],
            term: [
                "-\"coordinating bodies\"",
                "\"mental health\"",
            ],
            minimumShouldMatch: "30%",
            showInAskIzzyHealth: true,
        },
        "Emergency support": {
            $concat: {
                term: ["crisis"],
            },
            $unset: ["serviceTypes"],
            serviceTypesRaw: ["Crisis counselling"],
        },
        "Family or relationships": {
            $concat: {
                term: ["family", "relationship"],
            },
            serviceTypes: ["Relationship Assistance"],
        },
        "Drugs and alcohol counselling": {
            term: ["drugs", "alcohol"],
            serviceTypesRaw: ["Alcohol & Other Drug Counselling"],
            minimumShouldMatch: "30%",
        },
        "Gender or sexual identity": {
            $unset: ["serviceTypes"],
            $concat: {
                term: ["sexuality"],
            },
        },
        "Homelessness support": {
            $unset: ["serviceTypes", "minimumShouldMatch"],
            $concat: {
                term: ["-\"coordinating bodies\"", "-\"respite care\"","-hef -\"holiday accommodation\"" ,"\"homelessness support\""]
            },
            $removeElms: {
                term: [
                    "counselling",
                ],
            },
        },

        "Sexual assault or family violence": {
            $unset: ["serviceTypes"],
            serviceTypesRaw: [
                "Incest/sexual abuse counselling",
                "Domestic violence counselling",
            ],
        },
        "Gambling counselling": {
            $concat: {
                term: ["gambling"],
            },
            serviceTypes: ["Gambling Counselling"],
        },
    },
    showSupportSearchBar: true,
    descriptionsForAnswers: {
        "Mental and emotional health": "Help with anxiety, depression and mental health",
        "Emergency support": "Urgent help in a mental health crisis",
        "Family or relationships": "Counselling for healthy and safe relationships",
        "Drugs and alcohol counselling": "Support with addiction and substance use",
        "Gender or sexual identity": "Support, mental health and safety",
        "Homelessness support": "Help for people experiencing homelessness",
        "Sexual assault or family violence": "Support for current or past experiences of violence",
        "Gambling counselling": "Someone to talk to about gambling",
    },
    title: "Counselling services",
    resetDfvOptionsOnDisplay: true,
}: PersonalisationPage)
