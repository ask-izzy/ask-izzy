/* @flow */

import BaseQuestion, { remove } from "./BaseQuestion";

export default class AdvocacySubcategories extends BaseQuestion {
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-advocacy",
        question: "What do you want help with or advice about?",
        answers: {
            "Making a complaint":
                remove("consumer issues mediation discrimination")
                .remove("disputes advocacy")
                .append("ombudsman complaint"),
            "Get advice on your rights":
                remove("consumer issues mediation discrimination")
                .remove("disputes advocacy")
                .append("rights advice"),
            "Someone to speak for you":
                remove("consumer issues mediation discrimination")
                .remove("disputes advocacy")
                .append("advocacy"),
        },
    };
}
