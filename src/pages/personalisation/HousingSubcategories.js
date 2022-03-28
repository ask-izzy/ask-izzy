/* @flow */
import BaseQuestion from "./BaseQuestion";
import SleepTonight from "./SleepTonight";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-housing",
    question: "Which situation is most like yours?",
    possibleAnswers: {
        "Emergency accommodation": {
            serviceTypes: [
                "Refuge/ Crisis accommodation",
                "Short-Term Accommodation",
            ],
        },
        "Homelessness support": {
            serviceTypes: ["Homelessness Access Point"],
        },
        "Affordable housing": {
            serviceTypes: ["Social Housing"],
        },
        "Bond or rent help": {
            serviceTypes: ["Emergency financial assistance for accommodation"],
        },
        "Rental disputes": {
            serviceTypes: [],
        },
        "Support with everyday tasks": {
            serviceTypes: [],
        },
        "Supported accommodation and residential care": {
            serviceTypes: [
                "Supported Accommodation",
                "Supported Residential Accommodation",
                "Supported Residential Accommodation/Aged Care",
            ],
        },
    },
    descriptionsForAnswers: {
        "Emergency accommodation": "Need a place to stay.",
        "Homelessness support": "Help for people experiencing homelessness.",
        "Affordable housing": "Rental in government owned houses.",
        "Bond or rent help": "Help with rental payments.",
        "Rental disputes": "Deal with issues while renting.",
        "Support with everyday tasks":
            "Home help with cleaning, food, personal care.",
        "Supported accommodation and residential care":
            "Places to live with people who can help.",
    },
};

export default class HousingSubcategories extends BaseQuestion {
    static title: string = "Situation";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static getShouldIncludePage(): boolean {
        /* only show this question if the user has someone to sleep tonight */
        return (SleepTonight.savedAnswer !== "No");
    }
}
