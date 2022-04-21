/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

export default ({
    type: "question",
    name: "sub-life-skills",
    question: "Want to develop skills?",
    possibleAnswers: {
        "School": {
            $concat: {
                term: ["government", "schools"],
            },
            $removeElms: {
                term: ["life", "skills", "education"],
            },
        },
        "Training with support": {
            $concat: {
                term: ["supported", "vocational", "training"],
            },
            $removeElms: {
                term: ["life", "skills", "education"],
            },
        },
    },
    showSupportSearchBar: true,
    title: "Life skills",
    prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "School":
            return "Schools";
        default:
            return answer
        }
    },
}: PersonalisationPage)
