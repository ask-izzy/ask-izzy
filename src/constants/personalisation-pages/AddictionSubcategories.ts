import type {
    PersonalisationPage,
} from "@/types/personalisation-page.js"

export default ({
    type: "question",
    name: "sub-addiction",
    question: "What sort of help?",
    title: "Drugs & alcohol",
    prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Speak to someone":
            return "Counselling";
        default:
            return answer
        }
    },
    possibleAnswers: {
        "Rehab": {
            $concat: {
                term: [
                    "rehabilitation",
                ],
            },
        },
        "Drugs": {
            $concat: {
                term: [
                    "drugs",
                ],
            },
            $removeElms: {
                term: [
                    "substance",
                    "abuse",
                ],
            },
        },
        "Alcohol": {
            $concat: {
                term: [
                    "alcohol",
                ],
            },
            $removeElms: {
                term: [
                    "substance",
                    "abuse",
                ],
            },
        },
        "Needle exchange": {
            $concat: {
                term: [
                    "needle",
                    "exchange",
                ],
            },
            $removeElms: {
                term: [
                    "substance",
                    "abuse",
                ],
            },
        },
        "Speak to someone": {
            $concat: {
                term: [
                    "counselling",
                ],
            },
        },
    },
    showSupportSearchBar: true,
} as PersonalisationPage)
