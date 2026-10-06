import * as React from "react";

import AreYouSafe from "./AreYouSafe";
import OnlineSafetyLink from "../../components/OnlineSafetyLink";
import {
    getSavedPersonalisationAnswer,
} from "../../utils/personalisation"
import type {PersonalisationInfoPage} from "@/types/personalisation-page"

export default ({
    type: "info",
    name: "online-safety-screen",
    heading: "Everyone has the right to be safe.",
    title: "Help",
    baseTextBoxComponent: (<OnlineSafetyLink/> as React.ReactNode),
    noQuestionStepperStep: true,
    noQuestionStepperBreadcrumb: true,
    getShouldShowInSummary: (): boolean => false,
    getDoneButtonLabel: (): string => "OK - keep searching",
    getShouldIncludePage(): boolean {
        return !["", "Yes", "(skipped)"]
            .includes((getSavedPersonalisationAnswer(AreYouSafe) as string) || "");
    },
} as PersonalisationInfoPage);
