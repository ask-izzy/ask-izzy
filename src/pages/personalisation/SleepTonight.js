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

    static breadcrumbAnswer(): string {
        switch (this.answer) {
        case "Yes":
            return "Safe tonight";
        case "No" :
            return "Not safe tonight";
        default:
            return this.answer
        }
    }
}
