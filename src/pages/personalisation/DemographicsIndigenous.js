/* @flow */

/* eslint-disable no-unused-vars */
import React from "react";
import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";
import Blank from "../../icons/blank.svg";
import DemographicAtsi from "../../icons/demographic-atsi.svg";

export default class DemographicsIndigenous extends BaseQuestion {
    static title = "Indigenous";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-indigenous",
        question:
            "Would you like Aboriginal & Torres Strait Islander " +
            "specific services?",
        byline:
            "",
        answers: {
            // n.b. see also storage.getUserIsIndigenous when changing
            "Yes - show these first where possible":
                append("(Aboriginals & Torres Strait Islanders)"),
            "No - show me everything": append(""),
        },
        icons: {
            "Yes - show these first where possible": DemographicAtsi,
            "No - show me everything": Blank,
        },
    };

}
