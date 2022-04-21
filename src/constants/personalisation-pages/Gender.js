/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

export default ({
    type: "question",
    name: "gender",
    question: "Do you identify as…",
    possibleAnswers: {
        "Female": {
            $concat: {
                clientGenders: ["Female", "unspecified"],
            },
        },
        "Male": {
            $concat: {
                clientGenders: ["Male", "unspecified"],
            },
        },
        "Trans and Gender Diverse": {
            $concat: {
                clientGenders: ["Diverse", "unspecified"],
            },
        },
    },
    title: "Gender",
    prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Male":
            return "Men";
        case "Female":
            return "Women";
        case "Trans and Gender Diverse":
            return "Trans & Gender Diverse";
        default:
            return answer;
        }
    },
    summaryLabel: "How do you identify?",
}: PersonalisationPage)
