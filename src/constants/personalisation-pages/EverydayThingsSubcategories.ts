import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page.js"

export default ({
    type: "question",
    name: "sub-everyday-things",
    question: "What do you need?",
    possibleAnswers: {
        "Food packages/parcels/vouchers": {
            $concat: {
                term: ["\"Food Parcels & Food Vouchers\""],
            },
            $removeElms: {
                term: ["material", "aid"],
            },
        },
        "Transport": {
            $concat: {
                term: ["transport", "travel", "-hacc"],
            },
            $removeElms: {
                term: ["material", "aid"],
                serviceTypes: ["Material Aid"],
            },
        },
        "Keeping warm": {
            $concat: {
                term: ["swags", "blankets"],
            },
            $removeElms: {
                term: ["material", "aid"],
            },
        },
        "Clothes": {
            $concat: {
                term: ["clothes"],
            },
            $removeElms: {
                term: ["material", "aid"],
            },
        },
        "Showers": {
            $concat: {
                term: ["showers"],
            },
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
        },
        "Laundry": {
            $concat: {
                term: [
                    "laundry",
                    "facilities",
                    "washing",
                    "drying",
                ],
            },
        },
        "Household goods": {
            $concat: {
                term: ["household", "goods"],
            },
        },
        "Help with pets": {
            $concat: {
                term: [
                    "assistance",
                    "pets",
                    "-\"animal control\"",
                    "-effectiveness",
                ],
            },
            $removeElms: {
                term: ["material", "aid"],
                serviceTypes: ["Material Aid"],
            },
        },
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
} as PersonalisationQuestionPage)
