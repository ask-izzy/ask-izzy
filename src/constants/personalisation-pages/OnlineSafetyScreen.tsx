import React from "react"

import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe"
import OnlineSafetyLink from "@/src/components/OnlineSafetyLink"
import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation"
import {PersonalisationInfoPage} from "@/types/personalisation-page"

export default {
    type: "info",
    name: "online-safety-screen",
    heading: "Everyone has the right to be safe.",
    title: "Help",
    baseTextBoxComponent: (<OnlineSafetyLink/>),
    noQuestionStepperStep: true,
    noQuestionStepperBreadcrumb: true,
    shouldShowInSummary: false,
    getDoneButtonLabel: (): string => "OK - keep searching",
    getShouldIncludePage(): boolean {
        return !["", "Yes", "(skipped)"]
            .includes(getSavedPersonalisationAnswer(AreYouSafe) as string || "");
    },
} as PersonalisationInfoPage
