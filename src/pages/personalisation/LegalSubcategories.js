/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append, remove } from "./BaseQuestion";

export default class LegalSubcategories extends BaseMultiQuestion {
    static title = "Legal";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-legal",
        question: "What's happening?",
        answers: {
            "Legal advice": remove("legal -(coordinating bodies) -permits")
                .remove("-ceremonies -making -checks -electoral -taxation")
                .append("legal advice"),
            "Family violence": append("family violence -police"),
            "Tenancy issues": remove("legal -(coordinating bodies) -permits")
                .remove("-ceremonies -making -checks -electoral -taxation")
                .append("tenancy law -research"),
            "Victims of crime compensation": remove("legal -permits")
                .remove("-(coordinating bodies) -ceremonies -making")
                .remove("-checks -electoral -taxation")
                .append("victims of crime -police"),
            "Criminal charges":
                append("criminal charge criminal law -police"),
        },
    };
}
