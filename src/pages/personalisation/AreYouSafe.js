/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";
import icons from "../../icons";

export default class AreYouSafe extends BaseQuestion {
    static title = "Safety";

    static propTypes = BaseQuestion.propTypes;

    static defaultProps = {
        name: "are-you-safe",
        question: "Are you safe right now?",
        byline:
            "All of your answers are private and anonymous",
        answers: {
            "No": append(""),
            "I'm not sure": append(""),
            "Yes": append(""),
        },
        icons: {
            "No": icons.EscapeViolence,
            "I'm not sure": icons.Mental,
            "Yes": icons.House,
        },
        showOnlineSafetyLink: true,
    };

}
