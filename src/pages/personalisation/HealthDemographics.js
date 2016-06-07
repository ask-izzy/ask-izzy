/* @flow */

/* eslint-disable no-unused-vars */
import React from "react";
import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";

export default class HealthDemographics extends BaseQuestion {
    static title = "Indigenous";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "indigenous",
        question:
            "Do you identify as Aboriginal and/or Torres Strait Islander?",
        byline:
            "Services for both Aboriginal and/or Torres Strait Islanders are displayed with the Aboriginal flag.",
        answers: {
            // n.b. see also storage.getUserIsIndigenous when changing
            "Yes": append("Aboriginals & Torres Strait Islanders"),
            "No": append(""),
        },
    };

}
