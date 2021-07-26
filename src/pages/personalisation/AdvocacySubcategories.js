/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
import { remove } from "../../iss/Search";

export default class AdvocacySubcategories extends BaseQuestion {
    static title: string = "Advocacy";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "sub-advocacy",
        question: "What do you want help with or advice about?",
        answers: {
            "Making a complaint":
                remove("consumer issues mediation discrimination")
                    .remove("disputes advocacy")
                    .append("ombudsman complaint"),
            "Get advice on your rights":
                remove("consumer issues mediation discrimination")
                    .remove("disputes advocacy")
                    .append("rights advice"),
            "Someone to speak for you":
                remove("consumer issues mediation discrimination")
                    .remove("disputes advocacy")
                    .append("advocacy"),
        },
    };

    static breadcrumbAnswer(): string {
        switch (this.answer) {
        case "Making a complaint" :
            return "Complaints";
        case "Get advice on your rights" :
            return "Your rights";
        case "Someone to speak for you" :
            return "Representation";
        default:
            return this.answer
        }
    }
}
