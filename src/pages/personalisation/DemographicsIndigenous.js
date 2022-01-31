/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

/* eslint-disable no-unused-vars */
import * as React from "react";
import type {Node as ReactNode} from "react";
import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/ServiceSearchRequest";
import icons from "../../icons";

export default class DemographicsIndigenous extends BaseQuestion {
    static title: string = "Indigenous";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "sub-indigenous",
        question:
            "Would you like Aboriginal & Torres Strait Islander " +
            "specific services?",
        byline:
            "",
        possibleAnswers: {
            "Yes - show these first where possible":
                append("(Aboriginals & Torres Strait Islanders)"),
            "No - show me everything": append(""),
        },
        icons: {
            "Yes - show these first where possible": icons.DemographicAtsi,
            "No - show me everything": icons.Blank,
        },
    };

    static prettyPrintAnswer(answer: string): ReactNode {
        switch (answer) {
        case "Yes - show these first where possible":
            return <>
                <icons.AboriginalFlag/>
                <icons.TorresStraitIslandersFlag />
            </>
        default:
            return answer
        }
    }
}
