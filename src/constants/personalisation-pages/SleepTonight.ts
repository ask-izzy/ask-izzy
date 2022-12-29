import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page.js"

import {housingCrisisSearchQueryChanges} from "@/src/utils/housing-crisis.js";

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
} as PersonalisationQuestionPage)
