/* @flow */

import BaseQuestion, { remove, append } from "./BaseQuestion";

export default class SleepTonight extends BaseQuestion {
    static title = "Sleeping";

    static propTypes = BaseQuestion.propTypes;

    static defaultProps = {
        name: "sleep-tonight",
        question: "Do you have somewhere safe to sleep tonight?",
        answers: {
            "Yes": append(""),
            "No": remove("housing").append("crisis accommodation"),
        },
    };
}
