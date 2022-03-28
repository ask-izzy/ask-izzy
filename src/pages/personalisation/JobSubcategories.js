/* @flow */
import BaseQuestion from "./BaseQuestion";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-job",
    question: "Where do you want to start?",
    possibleAnswers: {
        "Finding a job": {
            serviceTypes: [
                "Employment",
                "-Support for business",
                "-Vocational Rehabilitation",
                "-Workplace Relations",
            ],
        },
        "Supported employment": {
            serviceTypes: ["Supported Employment"],
        },
        "Education": {
            serviceTypes: ["Education"],
        },
        "Community skills training": {
            serviceTypes: [],
        },
        "Volunteering": {
            serviceTypes: [],
        },
        "Libraries": {
            serviceTypes: ["Libraries"],
        },
    },
    descriptionsForAnswers: {
        "Finding a job": "Employment programs and services.",
        "Supported employment":
            "Employment services for people with additional needs.",
        "Education": "Schools and other centers for learning.",
        "Community skills training":
            "Local programs such as parenting, computer, or other skills.",
        "Volunteering": "Places to help and gain experience.",
        "Libraries": "Access to computers, books and information.",
    },
    showSupportSearchBar: true,
}

export default class JobSubcategories extends BaseQuestion {
    static title: string = "Jobs";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;
}
