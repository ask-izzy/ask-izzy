/* @flow */

/* eslint-disable no-unused-vars */
import React from "react";
import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";
import icons from "../../icons";

export default class DemographicsIndigenous extends BaseQuestion {
    static title = "Indigenous";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-indigenous",
        question:
            "Do you want to see Aboriginal & Torres Strait Islander " +
            "specific services?",
        byline:
            "Services for both Aboriginal and/or Torres Strait Islanders " +
            "are displayed with the Aboriginal and Torres Strait Islander " +
            "flags.",
        answers: {
            // n.b. see also storage.getUserIsIndigenous when changing
            "Yes - show these first where possible":
                append("(Aboriginals & Torres Strait Islanders)"),
            "No - show me everything": append(""),
        },
        icons: {
            "Yes - show these first where possible": icons.DemographicAtsi,
            "No - show me everything": icons.Blank,
        },
    };

}
