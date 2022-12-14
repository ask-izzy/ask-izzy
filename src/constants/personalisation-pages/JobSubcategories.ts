import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page"

export default ({
    type: "question",
    name: "sub-job",
    question: "Where do you want to start?",
    possibleAnswers: {
        "Employment": {
            $concat: {
                term: ["job", "searching"],
            },
            $removeElms: {
                term: ["employment"],
            },
        },
        "Volunteering": {
            $concat: {
                term: ["volunteering"],
            },
            $removeElms: {
                term: ["employment"],
                serviceTypes: ["Employment"],
            },
        },
    },
    showSupportSearchBar: true,
    title: "Jobs",
} as PersonalisationQuestionPage)
