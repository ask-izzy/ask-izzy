/* @flow */

import React from "react";
import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";
import icons from "../../icons";
import OnlineSafetyLink from "../../components/OnlineSafetyLink";

    static showInSummary(): boolean {
        return false;
    }

    static showPage(): boolean {
        return !this.answer;
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
            "No": icons.Cross,
            "I'm not sure": icons.QuestionMark,
            "Yes": icons.Tick,
        },
        showBaseTextBox: true,
        baseTextBoxComponent: <OnlineSafetyLink/>,
    };
}

export default AreYouSafe;
