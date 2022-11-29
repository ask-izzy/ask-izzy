/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

export default ({
    type: "question",
    name: "health-subcategory",
    question: "What sort of help do you need?",
    possibleAnswers: {
        "Doctor or general practitioner": {
            serviceTypes: ["General Practitioners"],
            $concat: {
                term: [
                    "\"general medical practitioners\"",
                ],
            },
            $removeElms: {
                term: [
                    "assistance pets",
                    "-\"animal control\"",
                    "-effectiveness",
                ],
            },
        },
        "Mental and emotional health": {
            serviceTypes: ["Mental Health"],
            $concat: {
                term: [
                    "\"mental health\"",
                ],
            },
            $removeElms: {
                term: [
                    "assistance pets",
                    "-\"animal control\"",
                    "-effectiveness",
                ],
            },
        },
        "Dentist": {
            serviceTypes: ["Dentists/Oral Health Professionals"],
            $concat: {
                term: [
                    "dentistry",
                ],
            },
            $removeElms: {
                term: [
                    "assistance pets",
                    "-\"animal control\"",
                    "-effectiveness",
                ],
            },
        },
        "Children's health": {
            serviceTypes: [
                "Children's health services",
                "Paediatricians & Neonatologists",
            ],
            $concat: {
                term: [
                    "health",
                    "children",
                ],
            },
            $removeElms: {
                term: [
                    "assistance pets",
                    "-\"animal control\"",
                    "-effectiveness",
                ],
            },
        },
        "Problems with feet": {
            serviceTypes: [
                "Podiatrists",
            ],
            $concat: {
                term: ["podiatry"],
            },
            $removeElms: {
                term: [
                    "assistance pets",
                    "-\"animal control\"",
                    "-effectiveness",
                ],
            },
        },
        "Hospital": {
            serviceTypes: [
                "Hospital",
            ],
            $concat: {
                term: [
                    "\"public hospital services\"",
                    "-pac",
                    "-medicare",
                ],
            },
            $removeElms: {
                term: [
                    "assistance pets",
                    "-\"animal control\"",
                    "-effectiveness",
                ],
            },
            $unset: ["showInAskIzzyHealth"],
        },
        "Alcohol and other drugs": {
            serviceTypes: ["Alcohol & Other Drugs"],
            $concat: {
                term: [
                    "substance abuse",
                    "-\"registered training\"",
                    "rehabilitation",
                ],
            },
            $removeElms: {
                term: [
                    "assistance pets",
                    "-\"animal control\"",
                    "-effectiveness",
                ],
            },
            $unset: ["showInAskIzzyHealth"],
        },
    },
    descriptionsForAnswers: {
        "Doctor": "Someone to talk to about any health problem.",
        "Mental and emotional health":
            "Help with anxiety, depression and mental health.",
        "Dentist": "Help with teeth and mouth health.",
        "Children's health": "Paediatricians and help for kids.",
        "Problems with feet": "Podiatrists for help with foot problems.",
        "Hospital": "Emergency rooms for urgent problems.",
        "Alcohol and other drugs": "Rehab, detox, managing withdrawals.",
    },
    showSupportSearchBar: true,
    title: "Health",
    resetDfvOptionsOnDisplay: true,
    prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Doctor or general practitioner":
            return "Doctor/GP";
        case "Social & emotional wellbeing":
            return "Mental health";
        case "Problems with feet":
            return "Podiatry";
        case "Domestic & family violence":
            return "Domestic & family violence help";
        case "Sexual assault":
            return "Sexual assault support";
        case "Children":
            return "For children";
        case "Hospital":
            return "Hospitals";
        default:
            return answer
        }
    },
}: PersonalisationPage)
