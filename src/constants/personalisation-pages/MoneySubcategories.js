/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

export default ({
    type: "question",
    name: "money-help-subcategory",
    question: "What do you need?",
    possibleAnswers: {
        "Centrelink": {
            name: "centrelink",
            term: ["centrelink"],
            serviceTypes: ["Centrelink"],
        },
        "Financial aid": {
            isBulkBilling: false,
            $concat: {
                term: [
                    "\"Emergency Relief\"",
                    "disadvantage",
                ],
            },
            $removeElms: {
                term: ["aid"],
            },
            $unset: ["serviceTypes"],
            serviceTypesRaw: ["Financial Aid"],
        },
        "No or low interest loans": {
            $concat: {
                term: ["nils", "low-interest"],
            },
            $removeElms: {
                term: ["financial", "aid"],
            },
            serviceTypes: [
                "Low-interest loans",
                "NILS",
            ],
        },
        "Financial counselling": {
            $concat: {
                term: ["counselling"],
            },
            $removeElms: {
                term: ["aid"],
            },
            serviceTypes: [
                "Financial Counselling",
            ],
        },
        "Bond or rental assistance": {
            $concat: {
                term: ["\"bond assistance\""],
            },
            serviceTypes: [
                "Bond Scheme",
                "Housing Establishment Fund",
            ],
        },
        "Gambling counselling": {
            $concat: {
                term: ["gambling", "counselling"],
            },
            $removeElms: {
                term: ["financial", "aid"],
            },
            serviceTypes: [
                "Gambling Counselling",
            ],
        },
    },
    descriptionsForAnswers: {
        "Centrelink": "Access to government support payments",
        "Financial aid": "Assistance with paying for food, bills, transport",
        "No or low interest loans":
            "Loans for people and families on low incomes",
        "Financial counselling": "Help managing money and debt",
        "Bond or rental assistance": "Help with rental payments or bond money",
        "Gambling counselling": "Someone to talk to about gambling",
    },
    showSupportSearchBar: true,
    title: "Money services",
    prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Financial assistance e.g. utility bills, petrol, food":
            return "Financial assistance";
        default:
            return answer
        }
    },
}: PersonalisationPage)
