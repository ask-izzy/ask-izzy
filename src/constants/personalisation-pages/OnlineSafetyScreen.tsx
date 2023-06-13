import React from "react"

import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe.js"
import OnlineSafetyLink from "@/src/components/OnlineSafetyLink.js"
import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation.js"
import {PersonalisationInfoPage} from "@/types/personalisation-page.js"

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
