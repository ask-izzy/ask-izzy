/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import React from "react";
import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";
import icons from "../../icons";
import DomesticViolenceLinkBar from "../../components/DomesticViolenceLinkBar";

class AreYouSafe extends BaseQuestion {
    static title: string = "Are you safe";

    static showPage(): boolean {
        return !this.savedAnswer;
    }

    static showInSummary(): boolean {
        return false;
    }

    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "are-you-safe",
        question: "Are you safe right now?",
        info:
            "All of your answers are private and anonymous.",
        possibleAnswers: {
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
}

export default AreYouSafe;
