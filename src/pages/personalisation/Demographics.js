/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

import { append } from "../../iss/Search";
import icons from "../../icons";
import { resetDfvOptions } from "../../utils";
import * as React from "react";

export default class Demographics extends BaseMultiQuestion {
    static title = "Personal";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "demographics",
        question: "Do any of these apply to you?",
        byline: "All of your answers are private and anonymous",
        answers: {
            "Escaping family violence": append("(family violence)"),
            // n.b. see also storage.getUserIsIndigenous when changing
            "Aboriginal and/or Torres Strait Islander":
                append("(Aboriginals & Torres Strait Islanders)"),
            "Family with children": append("families -srs"),
            "Couples": append("couples"),
            "Mental or emotional difficulties": append("(mental health)"),
            "Parole / recently released": append("post-release"),
            "Have a disability": append("disabilities"),
            "Veteran": append("veteran"),
            "Person seeking asylum": append("refugees"),
            "Have pets": append("pets")
                .append("-effectiveness"),
        },
        icons: {
            "Escaping family violence": icons.DemographicFamilyViolence,
            "Aboriginal and/or Torres Strait Islander": icons.DemographicAtsi,
            "Family with children": icons.DemographicChildren,
            "Couples": icons.DemographicCouple,
            "Mental or emotional difficulties": icons.Mental,
            "Parole / recently released": icons.DemographicParole,
            "Have a disability": icons.DemographicDisability,
            "Veteran": icons.DemographicVeteran,
            "Person seeking asylum": icons.DemographicRecentlyArrived,
            "Have pets": icons.DemographicPets,
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

    static breadcrumbAnswer(): ?Array<any> {
        if (this.answer && this.answer.length) {
            return this.answer.map((answer, index) => {
                switch (answer) {
                case "Aboriginal and/or Torres Strait Islander":
                    return (
                        <span>
                            <icons.AboriginalFlag/>
                            <icons.TorresStraitIslandersFlag />
                        </span>
                    );
                case "Person seeking asylum":
                    return "Asylum seeker"
                default:
                    return answer
                }
            })
        }
        return this.answer
    }
}
