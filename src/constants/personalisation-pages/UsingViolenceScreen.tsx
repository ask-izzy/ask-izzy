import React from "react";

import DomesticViolenceLink from "@/src/components/DomesticViolenceLink.js";
import DfvDemographics from "@/src/constants/personalisation-pages/DfvDemographics.js";
import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation.js"

export default ({
    type: "info",
    name: "using-violence",
    heading: "Worried about your behaviour?",
    title: "Using violence",
    baseTextBoxComponent: (<DomesticViolenceLink/>),

    shouldShowInSummary: false,
    noQuestionStepperStep: true,
    noQuestionStepperBreadcrumb: true,

    getDoneButtonLabel(): string {
        if (
            getSavedPersonalisationAnswer(DfvDemographics)
                ?.includes("LGBTIQA+")
        ) {
            return "Continue";
        }

        return "Continue to all services";
    },
    getShouldIncludePage(): boolean {
        return Boolean(
            getSavedPersonalisationAnswer(DfvDemographics)
                ?.includes("Using violence"),
        );
    },
});
