/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

export default ({
    type: "question",
    name: "sub-food",
    question: "What type of food do you need?",
    possibleAnswers: {
        "Community meals": {
            $removeElms: {
                term: ["-\"coordinating bodies\""],
            },
        },
        "Food packages/parcels/vouchers": {
            $concat: {
                term: ["\"Food Parcels & Food Vouchers\""],
                serviceTypes: ["Material Aid"],
            },
            $removeElms: {
                term: ["meals"],
            },
        },
        "Meals on Wheels": {
            $concat: {
                term: ["meals on wheels"],
            },
            $removeElms: {
                term: ["meals", "-\"meals on wheels\"", "-chsp"],
            },
        },
    },
    showSupportSearchBar: true,
    title: "Services",
    prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Food packages/parcels/vouchers":
            return "Parcels/vouchers";
        default:
            return answer
        }
    },
}: PersonalisationPage)
