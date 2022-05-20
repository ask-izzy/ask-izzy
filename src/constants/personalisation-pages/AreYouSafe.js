/* @flow */
import * as React from "react"

import type {
    PersonalisationQuestionPage,
} from "../../../flow/personalisation-page"
import icons from "../../icons";
import DomesticViolenceLink from "../../components/DomesticViolenceLink";

export default ({
    type: "question",
    title: "Are you safe",
    name: "are-you-safe",
    question: "Are you safe right now?",
    info: "All of your answers are private and anonymous.",
    possibleAnswers: {
        "No": {},
        "I'm not sure": {},
        "Yes": {},
    },
    icons: {
        "No": icons.CrossColor,
        "I'm not sure": icons.QuestionMarkColor,
        "Yes": icons.TickColor,
    },
    baseTextBoxComponent: <DomesticViolenceLink />,
    noQuestionStepperBreadcrumb: true,
    shouldShowInSummary: false,
}: PersonalisationQuestionPage)
