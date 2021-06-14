/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append } from "../../iss/Search";
import type {ElementConfig as ReactElementConfig} from "react";
import BaseQuestion from "./BaseQuestion";

export default class HousingForWho extends BaseMultiQuestion {
    static title: string = "Housing for who";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "housing-for-who",
        question: "I'm looking for housing for?",
        byline: "Select all that apply",
        answers: {
            "Myself only": append("Myself"),
            "Me and my children": append("families -srs"),
            "Me and my partner": append("couples"),
            "Me and my pets": append("pets")
                .append("-effectiveness"),
        },
        oldAnswers: {},
    };

    static breadcrumbToStandardAnswer(breadcrumbAnswer?: ?Array<any>): string {
        if (this.answer && this.answer.length) {
            for (let index: number = 0; index < this.answer.length; index++) {
                if (
                    // $FlowIgnore
                    this.breadcrumbAnswer()[index] === breadcrumbAnswer
                ) {
                    // $FlowIgnore
                    return this.answer[index]
                }
            }
        }
        return "";
    }

    static breadcrumbAnswer(): ?Array<any> {
        if (this.answer && this.answer.length) {
            return this.answer.map((answer) => {
                switch (answer) {
                case "Myself only":
                    return "Myself";
                case "Me and my partner":
                    return "Couples";
                case "Me and my pets":
                    return "Help with pets"
                case "Me and my children":
                    return "Families";
                default:
                    return answer;
                }
            })
        }
        return this.answer
    }
}
