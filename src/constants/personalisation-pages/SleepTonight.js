/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

import {housingCrisisSearchQueryChanges} from "../../utils/housing-crisis";

export default ({
    type: "question",
    name: "sleep-tonight",
    question: "Do you have somewhere safe to sleep tonight?",
    possibleAnswers: {
        "Yes": {},
        "No": housingCrisisSearchQueryChanges,
    },
    title: "Sleep tonight",
    prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Yes":
            return "Safe tonight";
        case "No" :
            return "Not safe tonight";
        default:
            return answer
        }
    },
}: PersonalisationPage)
