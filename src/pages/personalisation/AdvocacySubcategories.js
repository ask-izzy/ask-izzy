/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append, remove } from "./BaseQuestion";

export default class AdvocacySubcategories extends BaseMultiQuestion {
    static defaultProps = {
        name: "sub-advocacy",
        question: "Have you been treated badly?" +
            " Did you have poor service? Do you want to tell someone?",
        answers: {
            "Do you want to make a complaint?":
                remove("advocacy").append("ombudsman"),
            "Do you want help to work out a problem with a service?":
                remove("advocacy").append("mediation"),
            "Do you want to get advice on your rights?":
                remove("advocacy").append("rights advice"),
            "Do you want someone to speak for you?": append(""),
        },
    };
}
