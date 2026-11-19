import type {
    PersonalisationPage,
} from "@/types/personalisation-page"

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
    suggestionLabels: {
        "Yes": "for people safe tonight",
        "No": "for people not safe tonight",
        // Gives the same search as "Yes"
        "(skipped)": "for people safe tonight",
    },
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
} as PersonalisationPage)
