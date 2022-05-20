/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"
import React from "react";
import type {Node as ReactNode} from "react";
import icons from "../../icons";

export default ({
    type: "question",
    name: "sub-indigenous",
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
}: PersonalisationPage)
