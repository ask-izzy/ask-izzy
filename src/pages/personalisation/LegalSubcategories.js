/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";
import { resetDfvOptions } from "../../utils/domesticViolence";

export default class LegalSubcategories extends BaseQuestion {
    static title: string = "Legal";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "sub-legal",
        question: "What's happening?",
        answers: {
            "Police and liaison officers": append("police (police liaison)")
                .remove("(legal aid)"),
            "Legal advice": remove("legal -permits -ceremonies")
                .remove("-making -checks -electoral -taxation")
                .remove("-centrelink -immigration -(hire of facilities)")
                .remove("(legal aid)").append("legal advice"),
            "Domestic & family violence issues":
                append("(family violence) -police").remove("(legal aid)"),
            "Victims of crime compensation": remove("legal -permits")
                .remove("-(coordinating bodies) -ceremonies -making")
                .remove("-checks -electoral -taxation")
                .remove("-centrelink -immigration -(hire of facilities)")
                .remove("(legal aid)").append("victims of crime -police"),
        },
    };

    componentDidMount(): void {
        if (super.componentDidMount) {
            super.componentDidMount();
        }

        resetDfvOptions();
    }

    static breadcrumbAnswer(): string {
        switch (this.answer) {
        case "Police and liaison officers":
            return "Police & liaison officers";
        case "Domestic & family violence issues":
            return "Domestic & family violence";
        case "Victims of crime compensation":
            return "Victims of crime";
        default:
            return this.answer
        }
    }
}
