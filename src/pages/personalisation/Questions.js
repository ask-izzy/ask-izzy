/* @flow */

"use strict";

import React from 'react';

import BaseQuestion from './BaseQuestion';

class SleepTonight extends BaseQuestion {

    // flow:disable
    static defaultProps = {
        name: "sleep-tonight",
        question: "Do you have somewhere to sleep tonight?",
        answers: [
            "Yes",
            "No",
        ],
    };

    static getSearchForAnswer(request, answer) {
        if (answer == "No") {
            request.q = "crisis housing";
        }

        return request;
    }
}

export default {
    SleepTonight: SleepTonight,
};
