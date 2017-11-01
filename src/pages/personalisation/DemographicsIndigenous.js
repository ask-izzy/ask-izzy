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
            "Would you like Aboriginal & Torres Strait Islander " +
            "specific services?",
        byline:
            "",
        answers: {
            // n.b. see also storage.getUserIsIndigenous when changing
            "Yes - show these first where possible":
                append({indigenous_classification: "aboriginalspecific"}),
            "No - show me everything": append(""),
        },
        icons: {
            "Yes - show these first where possible": icons.DemographicAtsi,
            "No - show me everything": icons.Blank,
        },
    };

}
