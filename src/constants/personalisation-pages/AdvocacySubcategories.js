/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

export default ({
    name: "advice-and-advocacy-subcategory",
    type: "question",
    question: "What do you want help with or advice about?",
    possibleAnswers: {
        "Legal aid and advice": {
            serviceTypes: [
                "Legal Advice",
                "Legal Aid",
                "Legal Information",
                "Legal Representation",
            ],
            $concat: {
                term: [
                    "legal",
                    "-permits",
                    "-ceremonies",
                ],
            },
            $removeElms: {
                term: [
                    "advocacy",
                    "-research",
                ],
            },
        },
        "Help with fines": {
            $unset: ["serviceTypes"],
            $concat: {
                term: [
                    "fines",
                    "-CAYPINS",
                    "-\"court fund\"",
                    "-training",
                    "-\"allied health\"",
                    "-art",
                    "-dentist",
                    "-alcohol",
                ],
            },
            $removeElms: {
                term: [
                    "advice",
                    "advocacy",
                ],
            },
        },
        "Advocacy": {
            serviceTypes: ["Advocacy"],
            $concat: {
                term: [
                    "-\"disability advocacy\"",
                ],
            },
            $removeElms: {
                term: [
                    "advice",
                ],
            },
        },
        "Disability advocacy": {
            $unset: ["serviceTypes"],
            serviceTypesRaw: ["Disability advocacy"],
            $concat: {
                term: [
                    "disability",
                ],
            },
            $removeElms: {
                term: [
                    "-\"coordinating bodies\"",
                    "advice",
                    "advocacy",
                    "-research",
                ],
            },
        },
        "Homelessness support": {
            serviceTypes: ["Advocacy"],
            $concat: {
                term: [
                    "homelessness",
                ],
            },
            $removeElms: {
                term: [
                    "advice",
                ],
            },
        },
        "Rental disputes": {
            serviceTypes: ["Housing/Tenancy Information & Referral"],
            $concat: {
                term: [
                    "rent",
                    "tenant",
                    "-\"respite care\"",
                    "-hef",
                    "-\"holiday accommodation\"",
                ],
            },
            $removeElms: {
                term: [
                    "advice",
                    "advocacy",
                    "-research",
                ],
            },
        },
    },
    descriptionsForAnswers: {
        "Legal aid and advice": "Free or affordable support for legal issues.",
        "Help with fines": "Resolve or contest fines.",
        "Advocacy": "Someone to speak for you and fight for your rights.",
        "Disability advocacy":
            "Someone to assist with finding and accessing services.",
        "Homelessness support": "Help for people experiencing homelessness.",
        "Rental disputes": "Deal with issues while renting.",
    },
    showSupportSearchBar: true,
    title: "Services",
    prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Making a complaint" :
            return "Complaints";
        case "Get advice on your rights" :
            return "Your rights";
        case "Someone to speak for you" :
            return "Representation";
        default:
            return answer
        }
    },
}: PersonalisationPage)
