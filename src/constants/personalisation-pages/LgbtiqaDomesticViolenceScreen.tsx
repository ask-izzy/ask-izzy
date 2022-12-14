import React from "react"
import type {
    PersonalisationInfoPage,
} from "@/types/personalisation-page"

import DfvDemographics from "@/src/constants/personalisation-pages/DfvDemographics";
import DomesticViolenceLink from "@/src/components/DomesticViolenceLink";
import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation"

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
