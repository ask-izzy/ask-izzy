/* @flow */

import BaseQuestion from "./BaseQuestion";

export default class SleepTonight extends BaseQuestion {
    // flow:disable
    static defaultProps = {
        name: "sleep-tonight",
        question: "Do you have somewhere safe to sleep tonight?",
        answers: [
            "Yes",
            "No",
        ],
    };

    static getSearchForAnswer(request, answer) {
        if (answer == "No") {
            /* eslint-disable id-length */
            request.q = "crisis accommodation";
        }

        return request;
    }
}
