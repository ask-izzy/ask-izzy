/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append, remove } from "./BaseQuestion";

export default class AdvocacySubcategories extends BaseMultiQuestion {
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-advocacy",
        question: "What do you want help with or advice about?",
        answers: {
            "Making a complaint":
                remove("advocacy").append("ombudsman"),
            "Help working out a problem with a service":
                remove("advocacy").append("mediation"),
            "Get advice on your rights":
                remove("advocacy").append("rights advice"),
            "Someone to speak for you": append("advocacy"),
        },
    };
}
