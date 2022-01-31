/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";

import { append } from "../../iss/ServiceSearchRequest";
import icons from "../../icons";
import { resetDfvOptions } from "../../utils/domesticViolence";
import * as React from "react";
import type {Node as ReactNode} from "react";
import type {PersonalisationQuestionPageDefaultProps} from "../../utils/personalisation"

const ATSI_BREADCRUMB_ICON = (
    <span>
        <icons.AboriginalFlag/>
        <icons.TorresStraitIslandersFlag />
    </span>
)

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "demographics",
    question: "Do any of these apply to you?",
    byline: "Select all that apply",
    info: "All of your answers are private and anonymous.",
    multipleChoice: true,
    possibleAnswers: {
        "Escaping family violence": {
            $concat: {
                term: ['"family violence"'],
            }
        },
        "Aboriginal and/or Torres Strait Islander": {
            $concat: {
                term: ['"Aboriginals & Torres Strait Islanders"'],
            }
        },
        "Family with children": {
            $concat: {
                term: ["families", "-srs"],
            }
        },
        "Couples": {
            $concat: {
                term: ["couples"],
            }
        },
        "Mental or emotional difficulties": {
            $concat: {
                term: ['"mental health"'],
            }
        },
        "Parole / recently released": {
            $concat: {
                term: ["post-release"],
            }
        },
        "Have a disability": {
            $concat: {
                term: ["refugees"],
            }
        },
        "Veteran": {
            $concat: {
                term: ["veteran"],
            }
        },
        "Person seeking asylum": {
            $concat: {
                term: ["refugees"],
            }
        },
        "Have pets": {
            $concat: {
                term: [
                    "pets",
                    "-effectiveness"
                ],
            }
        },
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


export default class Demographics extends BaseQuestion {
    static title: string = "Personal";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

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
