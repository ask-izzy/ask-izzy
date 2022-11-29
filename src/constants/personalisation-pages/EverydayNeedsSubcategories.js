/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

export default ({
    type: "question",
    name: "everyday-needs-subcategory",
    question: "What do you need?",
    possibleAnswers: {
        "Clothes and household goods": {
            $concat: {
                term: [
                    "\"household goods\"",
                    "clothes",
                ],
            },
            serviceTypes: [
                "Material Aid",
                "Clothing",
                "Household goods and furniture",
            ],
        },
        "Transport": {
            $concat: {
                term: [
                    "transport",
                    "travel",
                    "-hacc",
                ],
            },
            $removeElms: {
                term: ["material", "aid"],
            },
            serviceTypes: [
                "Community Transport",
            ],
        },
        "Keeping warm": {
            $concat: {
                term: [
                    "swags",
                    "blankets",
                ],
            },
            $removeElms: {
                term: ["material", "aid"],
            },
            serviceTypes: [
                "Swags/Blankets",
            ],
        },
        "Technology": {
            $concat: {
                term: [
                    "wifi",
                    "internet",
                    "computer",
                ],
            },
            $removeElms: {
                term: ["material", "aid"],
            },
            serviceTypes: [
                "Internet Kiosks",
                "Libraries",
            ],
        },
        "Showers and laundry": {
            $concat: {
                term: [
                    "laundry",
                    "facilities",
                    "washing",
                    "drying",
                    "showers",
                ],
            },
            serviceTypes: [
                "Showers",
                "Laundry Facilities",
            ],
        },
        "Personal products": {
            $concat: {
                term: [
                    "toiletries",
                    "sanitary",
                    "products",
                    "tampons",
                ],
            },
            serviceTypes: [
                "Toiletries",
            ],
        },
        "Toilets": {
            $concat: {
                term: [
                    "\"public facilities\"",
                    "-\"hire of facilities\"",
                    "-maintenance",
                ],
            },
            $removeElms: {
                term: ["material", "aid"],
            },
            serviceTypes: [
                "Public Toilets",
            ],
        },
        "Support with everyday tasks": {
            $concat: {
                term: [
                    "daily living support",
                    "-\"respite care\"",
                    "-hef",
                    "-\"holiday accommodation\"",
                ],
            },
            $removeElms: {
                term: ["material", "aid"],
            },
            serviceTypes: [
                "Daily Living Support",
            ],
        },
        "Help with pets": {
            $concat: {
                term: [
                    "assistance pets",
                    "-\"animal control\"",
                    "-effectiveness",
                ],
            },
            $removeElms: {
                term: ["material", "aid"],
            },
            $unset: ["serviceTypes"],
        },
    },
    descriptionsForAnswers: {
        "Clothes and household goods": "Free or affordable material items",
        "Transport": "Help and assistance for travelling.",
        "Keeping warm": "Blankets, swags, sleeping bags.",
        "Technology": "Free wifi, charging stations or computer access.",
        "Showers and laundry": "Somewhere to shower and wash clothes.",
        "Personal products": "Hygiene and sanitary products",
        "Toilets": "Free to access toilets",
        "Support with everyday tasks":
            "Home help with cleaning, food, personal care",
        "Help with pets": "Shelter or assistance for pets",
    },
    showSupportSearchBar: true,
    title: "Services",
    prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Keeping warm":
            return "Blankets";
        case "Food packages/parcels/vouchers" :
            return "Food parcels/vouchers";
        default:
            return answer
        }
    },
}: PersonalisationPage)
