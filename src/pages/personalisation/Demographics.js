/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append } from "./BaseQuestion";

export default class Demographics extends BaseMultiQuestion {
    static defaultProps = {
        name: "demographics",
        question: "Do any of these apply to you?",
        answers: {
            /* eslint-disable max-len */
            "Aboriginal or Torres Strait Islander": append("indigenous"),
            "LGBTIQ": append("sexuality"),
            "Asylum seeker": append("refugee"),
            "Have a disability": append("disability"),
            "Have children": append("family"),
            "Have pets": append("pets"),
            "On parole or recently released from prison": append("post-release"),
            "No": append(""),
        },
    };

}
