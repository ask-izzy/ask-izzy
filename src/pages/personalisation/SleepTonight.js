/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";

export default class SleepTonight extends BaseQuestion {
    static title = "Sleeping";

    static propTypes = BaseQuestion.propTypes;

    static defaultProps = {
        name: "sleep-tonight",
        question: "Do you have somewhere safe to sleep tonight?",
        answers: {
            "Yes": append(""),
            "No": remove("housing")
                .remove("-(respite care)")
                .remove("-(housing information)")
                .remove("-hef")
                .append("crisis accommodation"),
        },
    };
}
