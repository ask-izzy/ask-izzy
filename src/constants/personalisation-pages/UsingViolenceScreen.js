/* @flow */
import * as React from "react";

import DomesticViolenceLink from "../../components/DomesticViolenceLink";
import DfvDemographics from "./DfvDemographics";
import DemographicsAtsiCaldLgbtiqa from "./DemographicsAtsiCaldLgbtiqa";
import {
    getSavedPersonalisationAnswer,
} from "../../utils/personalisation"

export default ({
    type: "info",
    name: "using-violence",
    heading: "Worried about your behaviour?",
    title: "Using violence",
    baseTextBoxComponent: (<DomesticViolenceLink/>: React.Node),

    shouldShowInSummary: false,
    noQuestionStepperStep: true,
    noQuestionStepperBreadcrumb: true,

    getDoneButtonLabel(): string {
        if (
            getSavedPersonalisationAnswer(DfvDemographics)?.includes("LGBTIQA+") ||
                getSavedPersonalisationAnswer(DemographicsAtsiCaldLgbtiqa)?.includes("LGBTIQA+")
        ) {
            return "Continue";
        }

        return "Continue to all services";
    },
    getShouldIncludePage(): boolean {
        return Boolean(
            getSavedPersonalisationAnswer(DfvDemographics)
                ?.includes("Using violence")
        );
    },
});
