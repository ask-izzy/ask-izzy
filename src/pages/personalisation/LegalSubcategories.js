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
            "Legal advice": remove("law")
                .append("legal advice"),
            "Family violence": append("family violence -police"),
            "Tenancy issues": append("tenancy"),
            "Victims of crime compensation": remove("law")
                .append("victims of crime -police"),
            "Criminal charges": append("criminal charge criminal law -police"),
        },
    };
}
