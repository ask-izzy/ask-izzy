/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append } from "./BaseQuestion";

export default class Demographics extends BaseMultiQuestion {
    static defaultProps = {
        name: "demographics",
        question: "Do any of these apply to you?",
        answers: {
            "Aboriginal or Torres Strait Islander": append("indigenous"),
            "LGBTIQ": append(""), // "lgbt" doesn't work in ISS
            "Asylum seeker": append("refugee"),
            "Have a disability": append("disability"),
            "Have children": append("family"),
            "Have pets": append("pets"),
            "On parole or recently released from prison": append("parole"),
            "No": append(""),
        },
    };

}
