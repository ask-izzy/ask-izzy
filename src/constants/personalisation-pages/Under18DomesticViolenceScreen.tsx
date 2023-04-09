import React from "react";

import DomesticViolenceLink from "@/src/components/DomesticViolenceLink.js";
import DfvDemographics from "@/src/constants/personalisation-pages/DfvDemographics.js";


import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation.js"



export default ({
    type: "info",
    name: "under-18-dfv",
    heading: "Under 18",
    title: "Under 18 help",
    baseTextBoxComponent: (<DomesticViolenceLink/>),
    shouldShowInSummary: false,
    noQuestionStepperStep: true,
    noQuestionStepperBreadcrumb: true,
    getDoneButtonLabel(): string {
        const answer = getSavedPersonalisationAnswer(DfvDemographics)
        if (
            answer && (
                answer.indexOf("LGBTIQA+") > -1 ||
                answer.indexOf("Using violence") > -1
            )
        ) {
            return "Continue";
        }

        return "Continue to all services";
    },
    getShouldIncludePage(): boolean {
        return Boolean(
            getSavedPersonalisationAnswer(DfvDemographics)?.includes("Under 18"),
        );
    },
});