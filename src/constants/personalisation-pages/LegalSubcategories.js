/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

export default ({
    type: "question",
    name: "sub-legal",
    question: "What's happening?",
    possibleAnswers: {
        "Police and liaison officers": {
            $concat: {
                term: ["police", "\"police liaison\""],
            },
            $removeElms: {
                term: ["\"legal aid\""],
            },
        },
        "Legal advice": {
            $concat: {
                term: ["  legal advice"],
            },
            $removeElms: {
                term: [
                    "\"legal aid\"",
                    "-making",
                    "-checks",
                    "-electoral",
                    "-taxation",
                    "-centrelink",
                    "-immigration",
                    "-\"hire of facilities\"",
                ],
            },
        },
        "Domestic & family violence issues": {
            $concat: {
                term: ["\"family violence\"", "-police"],
            },
            $removeElms: {
                term: [
                    "\"legal aid\"",
                ],
            },
        },
        "Victims of crime compensation": {
            $concat: {
                term: ["  victims", "of", "crime", "-police"],
            },
            $removeElms: {
                term: [
                    "\"legal aid\"",
                    "-checks",
                    "-electoral",
                    "-taxation",
                    "-centrelink",
                    "-immigration",
                    "-\"hire of facilities\"",
                ],
            },
        },
    },
    showSupportSearchBar: true,
    title: "Legal",
    resetDfvOptionsOnDisplay: true,
    prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Police and liaison officers":
            return "Police & liaison officers";
        case "Domestic & family violence issues":
            return "Domestic & family violence";
        case "Victims of crime compensation":
            return "Victims of crime";
        default:
            return answer
        }
    },
}: PersonalisationPage)
