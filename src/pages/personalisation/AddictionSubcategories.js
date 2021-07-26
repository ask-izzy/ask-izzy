/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";

export default class AddictionSubcategories extends BaseQuestion {
    static title: string = "Drugs & Alcohol";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "sub-addiction",
        question: "What sort of help?",
        answers: {
            "Rehab": append("rehabilitation"),
            "Drugs": remove("substance abuse").append("drugs"),
            "Alcohol": remove("substance abuse").append("alcohol"),
            "Needle exchange": remove("substance abuse")
                .append("needle exchange"),
            "Speak to someone": append("counselling"),
        },
    };

    static breadcrumbAnswer(): string {
        switch (this.answer) {
        case "Speak to someone":
            return "Counselling";
        default:
            return this.answer
        }
    }
}
