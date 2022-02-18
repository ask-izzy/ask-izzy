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
}

export default class JobSubcategories extends BaseQuestion {
    static title: string = "Jobs";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;
}
