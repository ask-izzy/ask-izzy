import React from "react"
import type {
    PersonalisationInfoPage,
} from "@/types/personalisation-page.js"

import DfvDemographics from "@/src/constants/personalisation-pages/DfvDemographics.js";
import DomesticViolenceLink from "@/src/components/DomesticViolenceLink.js";
import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation.js"

export default ({
    type: "info",
    name: "lgbtiqa-domestic-violence",
    heading: "LGBTIQA+",
    title: "LGBTIQA+ help",
    baseTextBoxComponent: <DomesticViolenceLink />,
    noQuestionStepperStep: true,
    noQuestionStepperBreadcrumb: true,
    shouldShowInSummary: false,
    getShouldIncludePage(): boolean {
        return Boolean(
            getSavedPersonalisationAnswer(DfvDemographics)?.includes("LGBTIQA+"),
        );
    },
    getDoneButtonLabel: () => "Continue to all services",
} as PersonalisationInfoPage)
