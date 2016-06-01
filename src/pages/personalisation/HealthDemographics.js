/* @flow */

import React from "react";
import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";

export default class HousingSubcategories extends BaseQuestion {
    static title = "Indigenous";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "indigenous",
        question: "Do you identify as Aboriginal and/or Torres Strait Islander?",
        byline: "All indigenous services are displayed as the Aboriginal flag",
        answers: {
            "Yes": append("Aboriginals & Torres Strait Islanders"),
            "No": append(""),
        },
    };

}
