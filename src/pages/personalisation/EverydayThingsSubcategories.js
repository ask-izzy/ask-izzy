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
        /* eslint-disable max-len */
        "Food packages/parcels/vouchers": {
            $concat: {
                term: ["(Food Parcels & Food Vouchers)"],
            },
            $removeElms: {
                term: ["material", "aid"],
            },
        },
        "Transport": {
            $concat: {
                term: ["transport", "travel", "-hacc"],
            },
            $removeElms: {
                term: ["material", "aid"],
                serviceTypes: ["Material Aid"],
            },
        },
        "Keeping warm": {
            $concat: {
                term: ["swags", "blankets"],
            },
            $removeElms: {
                term: ["material", "aid"],
            },
        },
        "Clothes": {
            $concat: {
                term: ["clothes"],
            },
            $removeElms: {
                term: ["material", "aid"],
            },
        },
        "Showers": {
            $concat: {
                term: ["showers"],
            },
        },
        "Personal products": {
            $concat: {
                term: [
                    "toiletries",
                    "sanitary",
                    "products",
                    "tampons",
                ],
            },
        },
        "Laundry": {
            $concat: {
                term: [
                    "laundry",
                    "facilities",
                    "washing",
                    "drying",
                ],
            },
        },
        "Household goods": {
            $concat: {
                term: ["household", "goods"],
            },
        },
        "Help with pets": {
            $concat: {
                term: [
                    "assistance",
                    "pets",
                    "-(animal control)",
                    "-effectiveness",
                ],
            },
            $removeElms: {
                term: ["material", "aid"],
                serviceTypes: ["Material Aid"],
            },
        },
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
