/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

export default ({
    type: "question",
    name: "sub-money",
    question: "What do you need?",
    possibleAnswers: {
        "Emergency aid": {
            $concat: {
                term: ["emergency", "aid"],
            },
        },
        "Bond or rental assistance": {
            $concat: {
                term: ["\"bond assistance\""],
            },
        },
        "Financial assistance e.g. utility bills, petrol, food": {
            $concat: {
                serviceTypes: ["Financial Aid"],
            },
        },
        "No interest & low interest loans": {
            $concat: {
                term: ["nils", "low-interest"],
            },
            $removeElms: {
                term: ["financial", "aid"],
            },
        },
        "Gambling counselling": {
            $concat: {
                term: ["gambling", "counselling"],
            },
            $removeElms: {
                term: ["financial", "aid"],
            },
        },
        "Financial counselling": {
            $concat: {
                term: [
                    "financial counselling",
                    "name:\"financial counselling\"",
                ],
            },
            $removeElms: {
                term: ["financial", "aid"],
            },
        },
    },
    showSupportSearchBar: true,
    title: "Money services",
    prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Financial assistance e.g. utility bills, petrol, food":
            return "Financial assistance";
        case "No interest & low interest loans":
            return "Money matters";
        case "Gambling counselling":
            return "Gambling";
        case "Financial counselling":
            return "Online counselling";
        default:
            return answer
        }
    },
}: PersonalisationPage)
