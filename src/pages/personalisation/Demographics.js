/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";

import { append } from "../../iss/ServiceSearchRequest";
import DemographicFamilyViolence from "../../icons/demographic-family-violence.svg";
import DemographicAtsi from "../../icons/demographic-atsi.svg";
import DemographicChildren from "../../icons/demographic-children.svg";
import DemographicCouple from "../../icons/demographic-couple.svg";
import Mental from "../../icons/mental.svg";
import DemographicParole from "../../icons/demographic-parole.svg";
import DemographicDisability from "../../icons/demographic-disability.svg";
import DemographicVeteran from "../../icons/demographic-veteran.svg";
import DemographicRecentlyArrived from "../../icons/demographic-recently-arrived.svg";
import DemographicPets from "../../icons/demographic-pets.svg";
import AboriginalFlag from "../../icons/aboriginal-flag.svg";
import TorresStraitIslandersFlag from "../../icons/torres-strait-islanders-flag.svg";
import { resetDfvOptions } from "../../utils/domesticViolence";
import * as React from "react";
import type {Node as ReactNode} from "react";

const ATSI_BREADCRUMB_ICON = (
    <span>
        <AboriginalFlag/>
        <TorresStraitIslandersFlag />
    </span>
)


export default class Demographics extends BaseQuestion {
    static title: string = "Personal";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "demographics",
        question: "Do any of these apply to you?",
        byline: "Select all that apply",
        info: "All of your answers are private and anonymous.",
        multipleChoice: true,
        possibleAnswers: {
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
            "Escaping family violence": DemographicFamilyViolence,
            "Aboriginal and/or Torres Strait Islander": DemographicAtsi,
            "Family with children": DemographicChildren,
            "Couples": DemographicCouple,
            "Mental or emotional difficulties": Mental,
            "Parole / recently released": DemographicParole,
            "Have a disability": DemographicDisability,
            "Veteran": DemographicVeteran,
            "Person seeking asylum": DemographicRecentlyArrived,
            "Have pets": DemographicPets,
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

    static prettyPrintAnswer(answer: string): ReactNode {
        switch (answer) {
        case "Aboriginal and/or Torres Strait Islander":
            return ATSI_BREADCRUMB_ICON;
        case "Person seeking asylum":
            return "Seeking asylum"
        case "Parole / recently released":
            return "On parole"
        case "Have a disability":
            return "With disability"
        case "Have pets":
            return "Help with pets"
        case "Family with children":
            return "Families"
        case "Escaping family violence":
            return "Escaping violence"
        default:
            return answer;
        }
    }
}
