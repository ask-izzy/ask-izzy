/* @flow */
import React from "react";
import type {Node as ReactNode} from "react";

import type {
    PersonalisationQuestionPage,
} from "../../../flow/personalisation-page"
import icons from "../../icons";
import {
    getSavedPersonalisationAnswer,
} from "../../utils/personalisation"
import HealthSubcategories from "./HealthSubcategories";
import CounsellingSubcategories from "./CounsellingSubcategories";

export default ({
    type: "question",
    name: "demographics-indigenous",
    question:
        "Would you like Aboriginal & Torres Strait Islander " +
        "specific services?",
    possibleAnswers: {
        "Yes - show these first where possible": {
            $concat: {
                term: ["\"Aboriginals & Torres Strait Islanders\""],
            },
        },
        "No - show me everything": {},
    },
    icons: {
        "Yes - show these first where possible": icons.DemographicAtsi,
        "No - show me everything": icons.Blank,
    },
    title: "Indigenous",
    prettyPrintAnswer(answer: string): ReactNode {
        switch (answer) {
        case "Yes - show these first where possible":
            return <>
                <icons.AboriginalFlag/>
                <icons.TorresStraitIslandersFlag />
            </>
        default:
            return answer
        }
    },
    getShouldShowInSummary(category) {
        return this.getShouldIncludePage(category)
    },
    getShouldIncludePage: (category) => {
        if (category?.key === "health") {
            return [
                "Dentist",
                "Problems with feet",
                "Hospital",
                "Alcohol and other drugs",
            ].includes(
                getSavedPersonalisationAnswer(HealthSubcategories)
            )
        } else if (category?.key === "support-and-counselling") {
            return [
                "Emergency support",
                "Gender or sexual identity",
                "Homelessness support",
                "Sexual assault or family violence",
            ]
                .includes(getSavedPersonalisationAnswer(CounsellingSubcategories))
        }
        return true
    },
}: PersonalisationQuestionPage)
