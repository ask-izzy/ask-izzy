/* @flow */

"use strict";

import React from 'react';

import BaseQuestion from './BaseQuestion';
import BaseMultiQuestion from './BaseMultiQuestion';

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

class HousingSubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-housing",
        question: "Do you need any of these?",
        answers: [
            "Help finding somewhere to live",
            "Help with paying rent",
            "Help with paying utility bills",
            "Help with a legal issue",
        ],
    };

    static getSearchForAnswer(request, answer) {
        return request;
    }
}

class Demographics extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "demographics",
        question: "Do any of these apply to you?",
        answers: [
            "Aboriginal or Torres Strait Islander",
            "LGBTIQ",
            "Asylum seeker",
            "Have a disability",
            "Have children",
            "Have pets",
            "On parole or recently released from prison",
        ],
    };

    static getSearchForAnswer(request, answer) {
        return request;
    }
}

export default {
    Demographics: Demographics,
    HousingSubcategories: HousingSubcategories,
    SleepTonight: SleepTonight,
};
