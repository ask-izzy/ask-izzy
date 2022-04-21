/* @flow */
import * as React from "react"

import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"
import DfvDemographics from "./DfvDemographics";
import DomesticViolenceLink from "../../components/DomesticViolenceLink";
import {
    getSavedPersonalisationAnswer,
} from "../../utils/personalisation"

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
            getSavedPersonalisationAnswer(DfvDemographics)?.includes("LGBTIQA+")
        );
    },
    getDoneButtonLabel: () => "Continue to all services",
}: PersonalisationPage)
