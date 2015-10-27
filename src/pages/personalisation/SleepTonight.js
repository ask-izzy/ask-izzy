/* @flow */

import BaseQuestion, { replace, append } from "./BaseQuestion";

export default class SleepTonight extends BaseQuestion {
    static defaultProps = {
        name: "sleep-tonight",
        question: "Do you have somewhere safe to sleep tonight?",
        answers: {
            "Yes": append(""),
            "No": replace("crisis accommodation"),
        },
    };
}
