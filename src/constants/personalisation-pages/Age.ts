import type {
    PersonalisationPage,
} from "@/types/personalisation-page.js"


export default ({
    type: "question",
    name: "age",
    question: "How old are you?",
    possibleAnswers: {
        "0 to 17": {
            $concat: {
                term: ["children", "youth"],
                ageGroups: [
                    "unspecified",
                    "Prenatal",
                    "Baby",
                    "Toddler",
                    "Preschool",
                    "School Age",
                    "Early Adolescent",
                    "Mid Adolescent",
                    "Late Adolescent",
                ],
            },
        },
        "18 to 26": {
            $concat: {
                ageGroups: [
                    "unspecified",
                    "Young Adult",
                ],
            },
        },
        "27 to 39": {
            $concat: {
                ageGroups: [
                    "unspecified",
                    "Adult",
                ],
            },
        },
        "40 to 54": {
            $concat: {
                ageGroups: [
                    "unspecified",
                    "Middle Aged Adult",
                ],
            },
        },
        "55 to 64": {
            $concat: {
                ageGroups: [
                    "unspecified",
                    "Pre-retirement Age",
                ],
            },
        },
        "65 or older": {
            $concat: {
                term: ["aged"],
                ageGroups: [
                    "unspecified",
                    "Aged Persons",
                ],
            },
        },
    },
    title: "Age",
    prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "0 to 17":
            return "0-17";
        case "18 to 26" :
            return "18-26";
        case "27 to 39":
            return "27-39";
        case "40 to 54" :
            return "40-54";
        case "55 to 64":
            return "55-64";
        case "65 or older" :
            return "65+";
        default:
            return answer
        }
    },
} as PersonalisationPage)
