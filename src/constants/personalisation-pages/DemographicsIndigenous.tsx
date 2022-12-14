import React, {ReactNode} from "react";

import DemographicAtsi from "@/src/icons/DemographicAtsi";
import Blank from "@/src/icons/Blank";
import AboriginalFlag from "@/src/icons/AboriginalFlag";
import TorresStraitIslandersFlag from "@/src/icons/TorresStraitIslandersFlag";

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
        "Yes - show these first where possible": DemographicAtsi,
        "No - show me everything": Blank,
    },
    title: "Indigenous",
    prettyPrintAnswer(answer: string): ReactNode {
        switch (answer) {
        case "Yes - show these first where possible":
            return <>
                <AboriginalFlag/>
                <TorresStraitIslandersFlag />
            </>
        default:
            return answer
        }
    },
} as any)
