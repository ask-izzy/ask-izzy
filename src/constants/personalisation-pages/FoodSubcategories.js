/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

export default ({
    type: "question",
    name: "food-subcategory",
    question: "What type of food do you need?",
    possibleAnswers: {
        "Meals": {
            term: ["meals"],
            $unset: ["serviceTypes"],
            serviceTypesRaw: ["Meals"],
        },
        "Food parcels / groceries": {
            term: ["\"food parcels\""],
            $unset: ["serviceTypes"],
            serviceTypesRaw: ["Food Parcels"],
        },
        "Food vouchers": {
            term: ["\"food vouchers\""],
            $unset: ["serviceTypes"],
            serviceTypesRaw: ["Food Vouchers"],
        },
    },
    descriptionsForAnswers: {
        "Meals": "Free or low-cost meals",
        "Food parcels / groceries": "Fresh food and pantry items",
        "Food vouchers": "To spend at the supermarket",
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
