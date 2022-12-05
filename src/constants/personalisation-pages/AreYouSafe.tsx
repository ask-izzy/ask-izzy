import React from "react"

import {PersonalisationQuestionPage} from "@/types/personalisation-page"
import DomesticViolenceLink from "@/src/components/DomesticViolenceLink"
import CrossColor from "@/src/icons/CrossColor"
import QuestionMarkColor from "@/src/icons/QuestionMarkColor"
import TickColor from "@/src/icons/TickColor"

export default {
    type: "question",
    title: "Are you safe",
    name: "are-you-safe",
    question: "Are you safe right now?",
    info: "All of your answers are private and anonymous.",
    possibleAnswers: {
        No: {},
        "I'm not sure": {},
        Yes: {},
    },
    icons: {
        No: CrossColor,
        "I'm not sure": QuestionMarkColor,
        Yes: TickColor,
    },
    baseTextBoxComponent: <DomesticViolenceLink />,
    noQuestionStepperBreadcrumb: true,
    shouldShowInSummary: false,
} as PersonalisationQuestionPage
