/* @flow */

import React from "react";
import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";
import CrossColor from "../../icons/cross-color.svg";
import TickColor from "../../icons/tick-color.svg";
import QuestionMarkColor from "../../icons/question-mark-color.svg";
import DomesticViolenceLinkBar from "../../components/DomesticViolenceLinkBar";

class AreYouSafe extends BaseQuestion {
    static title = "Safety";

    static showPage(): boolean {
        return !this.answer;
    }

    static showInSummary(): boolean {
        return false;
    }

    static defaultProps = {
        name: "are-you-safe",
        question: "Are you safe right now?",
        byline:
            "All of your answers are private and anonymous",
        answers: {
            "No": append(""),
            "I'm not sure": append(""),
            "Yes": append(""),
        },
        icons: {
            "No": CrossColor,
            "I'm not sure": QuestionMarkColor,
            "Yes": TickColor,
        },
        showDVLinkBar: true,
        textDVLinkBar: <DomesticViolenceLinkBar/>,
    };
}

export default AreYouSafe;
