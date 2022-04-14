/* @flow */
import BaseQuestion from "./BaseQuestion";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"


// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-everyday-things",
    question: "What do you need?",
    possibleAnswers: {
        "Clothes and household goods": {
            serviceTypes: [
                "Clothing",
                "Household goods and furniture",
            ],
        },
        "Transport": {
            serviceTypes: [
                "Community Transport",
            ],
        },
        "Keeping warm": {
            serviceTypes: [
                "Swags/Blankets",
            ],
        },
        "Technology": {
            serviceTypes: [
                "Internet Kiosks",
                "Libraries",
            ],
        },
        "Showers and laundry": {
            serviceTypes: [
                "Showers",
                "Laundry Facilities",
            ],
        },
        "Personal products": {
            serviceTypes: [
                "Toiletries",
            ],
        },
        "Toilets": {
            serviceTypes: [
                "Public Toilets",
            ],
        },
        "Support with everyday tasks": {
            serviceTypes: [
                "Daily Living Support",
            ],
        },
        "Help with pets": {
            serviceTypes: [],
        },
    },
    descriptionsForAnswers: {
        "Clothes and household goods": "Free or affordable material items",
        "Transport": "Help and assistance for travelling.",
        "Keeping warm": "Blankets, swags, sleeping bags.",
        "Technology": "Free wifi, charging stations or computer access.",
        "Showers and laundry": "Somewhere to shower and wash clothes.",
        "Personal products": "Hygiene and sanitary products",
        "Toilets": "Free to access toilets",
        "Support with everyday tasks":
            "Home help with cleaning, food, personal care",
        "Help with pets": "Shelter or assistance for pets",
    },
    showSupportSearchBar: true,
}

export default class EverydayThingsSubcategories extends BaseQuestion {
    static title: string = "Services";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Keeping warm":
            return "Blankets";
        case "Food packages/parcels/vouchers" :
            return "Food parcels/vouchers";
        default:
            return answer
        }
    }
}
