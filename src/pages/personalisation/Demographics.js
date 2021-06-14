/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseMultiQuestion from "./BaseMultiQuestion";

import { append } from "../../iss/Search";
import icons from "../../icons";
import { resetDfvOptions } from "../../utils/domesticViolence";
import * as React from "react";

const ATSI_BREADCRUMB_ICON = (
    <span>
        <icons.AboriginalFlag/>
        <icons.TorresStraitIslandersFlag />
    </span>
)


export default class Demographics extends BaseMultiQuestion {
    static title: string = "Personal";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseMultiQuestion> = {
        name: "demographics",
        question: "Do any of these apply to you?",
        byline: "All of your answers are private and anonymous.",
        answers: {
            "Escaping family violence": append("(family violence)"),
            // n.b. see also storage.getUserIsIndigenous when changing
            "Aboriginal and/or Torres Strait Islander":
                append("(Aboriginals & Torres Strait Islanders)"),
            "Mental or emotional difficulties": append("(mental health)"),
            "Parole / recently released": append("post-release"),
            "Have a disability": append("disabilities"),
            "Veteran": append("veteran"),
            "Person seeking asylum": append("refugees"),
        },
        icons: {
            "Escaping family violence": icons.DemographicFamilyViolence,
            "Aboriginal and/or Torres Strait Islander": icons.DemographicAtsi,
            "Mental or emotional difficulties": icons.Mental,
            "Parole / recently released": icons.DemographicParole,
            "Have a disability": icons.DemographicDisability,
            "Veteran": icons.DemographicVeteran,
            "Person seeking asylum": icons.DemographicRecentlyArrived,
        },
        oldAnswers: {
            "Indigenous": "Aboriginal and/or Torres Strait Islander",
            "Aboriginal": "Aboriginal and/or Torres Strait Islander",
        },
    };

    componentDidMount(): void {
        if (super.componentDidMount) {
            super.componentDidMount();
        }

        resetDfvOptions();
    }


    static breadcrumbToStandardAnswer(breadcrumbAnswer?: ?Array<any>): string {
        if (this.answer && this.answer.length) {
            for (let index: number = 0; index < this.answer.length; index++) {
                if (breadcrumbAnswer === ATSI_BREADCRUMB_ICON &&
                    // $FlowIgnore
                    this.answer[index] ===
                    "Aboriginal and/or Torres Strait Islander"
                ) {
                    return this.answer[index] ;
                } else if (
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
                case "Aboriginal and/or Torres Strait Islander":
                    return ATSI_BREADCRUMB_ICON;
                case "Person seeking asylum":
                    return "Seeking asylum"
                case "Parole / recently released":
                    return "On parole"
                case "Have a disability":
                    return "With disability"
                case "Escaping family violence":
                    return "Escaping violence"
                default:
                    return answer
                }
            })
        }
        return this.answer
    }
}
