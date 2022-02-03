/* @flow */
import BaseQuestion from "./BaseQuestion";
import { remove } from "../../iss/ServiceSearchRequest";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-job",
    question: "Where do you want to start?",
    possibleAnswers: {
        "Employment": remove("employment")
            .append("job searching"),
        "Volunteering": remove("employment")
            .remove({service_type: ["employment"]})
            .append("volunteering"),
    },
    showSupportSearchBar: true,
}

export default class JobSubcategories extends BaseQuestion {
    static title: string = "Jobs";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;
}
