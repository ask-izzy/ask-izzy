import type {
    PersonalisationPage,
} from "@/types/personalisation-page.js"


export default ({
    name: "sub-advocacy",
    type: "question",
    question: "What do you want help with or advice about?",
    possibleAnswers: {
        "Making a complaint": {
            $concat: {
                term: ["ombudsman", "complaint"],
            },
            $removeElms: {
                term: [
                    "consumer",
                    "issues",
                    "mediation",
                    "discrimination",
                    "disputes advocacy",
                ],
            },
        },
        "Get advice on your rights": {
            $concat: {
                term: ["rights", "advice"],
            },
            $removeElms: {
                term: [
                    "consumer",
                    "issues",
                    "mediation",
                    "discrimination",
                    "disputes advocacy",
                ],
            },
        },
        "Someone to speak for you": {
            $concat: {
                term: ["advocacy"],
            },
            $removeElms: {
                term: [
                    "consumer",
                    "issues",
                    "mediation",
                    "discrimination",
                    "disputes advocacy",
                ],
            },
        },
    },
    showSupportSearchBar: true,
    title: "Services",
    prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Making a complaint" :
            return "Complaints";
        case "Get advice on your rights" :
            return "Your rights";
        case "Someone to speak for you" :
            return "Representation";
        default:
            return answer
        }
    },
} as PersonalisationPage)
