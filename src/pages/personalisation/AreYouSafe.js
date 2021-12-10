/* @flow */
import React from "react";
import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/ServiceSearchRequest";
import CrossColor from "../../icons/cross-color.svg";
import TickColor from "../../icons/tick-color.svg";
import QuestionMarkColor from "../../icons/question-mark-color.svg";
import DomesticViolenceLinkBar from "../../components/DomesticViolenceLinkBar";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation";

// We need to create the defaultProps out of the component first otherwise flow
// doesn't typecheck it
export const defaultProps: PersonalisationQuestionPageDefaultProps = {
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
        "No": CrossColor,
        "I'm not sure": QuestionMarkColor,
        "Yes": TickColor,
    },
    showDVLinkBar: true,
    textDVLinkBar: <DomesticViolenceLinkBar/>,
};
class AreYouSafe extends BaseQuestion {
    static title: string = "Are you safe";

    static showPage(): boolean {
        return !this.savedAnswer;
    }

    static showInSummary(): boolean {
        return false;
    }

    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;
}

export default AreYouSafe;
