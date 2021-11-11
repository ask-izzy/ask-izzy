/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
import Location from "./Location";
import { append, housingCrisis } from "../../iss/ServiceSearchRequest";

export default class SleepTonight extends BaseQuestion {
    static title: string = "Sleep tonight";

    static propTypes = BaseQuestion.propTypes;

    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "sleep-tonight",
        question: "Do you have somewhere safe to sleep tonight?",
        possibleAnswers: {
            "Yes": append(""),
            "No": housingCrisis(() => Location.shouldInjectAccessPoints()),
        },
    };

    static prettyPrintSavedAnswer(): string | Array<string> {
        switch (this.savedAnswer) {
        case "Yes":
            return "Safe tonight";
        case "No" :
            return "Not safe tonight";
        default:
            return this.savedAnswer
        }
    }
}
