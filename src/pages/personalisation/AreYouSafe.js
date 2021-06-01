/* @flow */

import React from "react";
import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";
import icons from "../../icons";
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
            "No": icons.CrossColor,
            "I'm not sure": icons.QuestionMarkColor,
            "Yes": icons.TickColor,
        },
        showDVLinkBar: true,
        textDVLinkBar: <DomesticViolenceLinkBar/>,
    };

    static breadcrumbAnswer(): string {
        switch (this.answer) {
        case "Yes":
            return "Safe";
        case "No" :
            return "Not safe";
        default:
            return this.answer
        }
    }
}

export default AreYouSafe;
