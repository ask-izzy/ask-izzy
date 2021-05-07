/* @flow */

import BaseQuestion from "./BaseQuestion";
import Location from "./Location";
import { append, housingCrisis } from "../../iss/Search";

export default class SleepTonight extends BaseQuestion {
    static title = "Sleeping";

    static propTypes = BaseQuestion.propTypes;

    static defaultProps = {
        name: "sleep-tonight",
        question: "Do you have somewhere safe to sleep tonight?",
        answers: {
            "Yes": append(""),
            "No": housingCrisis(() => Location.shouldInjectAccessPoints()),
        },
    };

    static headingValue(): string {
        return this.answer === "Yes" ? "With somewhere safe to sleep"
            : "Without somewhere safe to sleep";
    }
}
