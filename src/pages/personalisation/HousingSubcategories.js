/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
import SleepTonight from "./SleepTonight";
import Location from "./Location";
import { remove } from "../../iss/ServiceSearchRequest";
import {housingCrisisSearchQueryChanges} from "../../utils/housing-crisis";
import type {PersonalisationQuestionPageDefaultProps} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-housing",
    question: "Which situation is most like yours?",
    possibleAnswers: {
        "On the street": housingCrisisSearchQueryChanges,
        "Couch surfing": {
            $concat: {
                term: [
                    "homeless",
                    "accommodation"
                ]
            },
            $removeElms: {
                term: [
                    "housing"
                ]
            }
        },
        "In a rooming house": {
            $concat: {
                term: [
                    "community",
                    "housing",
                    '-"rooming house"'
                ]
            },
            $removeElms: {
                term: [
                    "housing"
                ]
            }
        },
        "Private rental": {
            $concat: {
                term: [
                    "transitional",
                    "accommodation",
                ]
            },
            $removeElms: {
                term: [
                    "housing"
                ]
            }
        },
        "Public housing": {
            $concat: {
                term: [
                    "social",
                    "housing",
                    '-"public rental"',
                    '-"public housing"'
                ]
            },
            $removeElms: {
                term: [
                    "housing"
                ]
            }
        },
        "Mortgaged housing": {
            $concat: {
                term: [
                    "transitional",
                    "accommodation",
                ]
            },
            $removeElms: {
                term: [
                    "housing"
                ]
            }
        },
    }
}

export default class HousingSubcategories extends BaseQuestion {
    static title: string = "Situation";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static getShouldIncludePage(): boolean {
        /* only show this question if the user has someone to sleep tonight */
        return (SleepTonight.savedAnswer !== "No");
    }
}
