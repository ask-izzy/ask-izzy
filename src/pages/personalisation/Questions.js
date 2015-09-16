/* @flow */

"use strict";

import React from 'react';

import BaseQuestion from './BaseQuestion';
import BaseMultiQuestion from './BaseMultiQuestion';

export class SleepTonight extends BaseQuestion {
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
            request.q = "crisis accommodation";
        }

        return request;
    }
}

export class Age extends BaseQuestion {
    // flow:disable
    static defaultProps = {
        name: "age",
        question: "How old are you?",
        answers: [
            "26 or younger",
            "26 to 54",
            "55 or older",
        ],
    };

    static getSearchForAnswer(request, answer) {
        return request;
    }
}

export class HousingSubcategories extends BaseMultiQuestion {
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

    static getSearchForAnswer(request, answers) {
        if (!request.q) {
            // flow needs to be sure request.q exists
            throw new Error("Unexpected");
        } else {
            var q = request.q;
        }

        if (answers.has("Help with paying rent")) {
            q += " rental assistance";
        }

        if (answers.has("Help with paying utility bills")) {
            q += " utility bills";
        }

        if (answers.has("Help with a legal issue")) {
            q += " tenancy";
        }

        request.q = q;

        return request;
    }

    static showQuestion() {
        /* only show this question if the user has someone to sleep tonight */
        return (SleepTonight.answer == 'Yes');
    }
}

export class Gender extends BaseQuestion {
    // flow:disable
    static defaultProps = {
        name: "gender",
        question: "Do you identify as…",
        answers: [
            "Female",
            "Male",
            "Neither/Both/Something else",
        ],
    };

    static getSearchForAnswer(request, answer) {
        if (!request.q) {
            // flow needs to be sure request.q exists
            throw new Error("Unexpected");
        } else if (answer == "Male") {
            request.q += " -female";
        } else if (answer == "Female") {
            request.q += " -male";
        }

        return request;
    }

    // flow:disable
    static summaryLabel = "How do you identify?";
}

export class Demographics extends BaseMultiQuestion {
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

    static getSearchForAnswer(request, answers) {
        if (!request.q) {
            // flow needs to be sure request.q exists
            throw new Error("Unexpected");
        } else {
            var q = request.q;
        }

        if (answers.has("Aboriginal or Torres Strait Islander")) {
            q += " indigenous";
        }

        // Broken
        // if (answers.has("LGBTIQ")) {
        //     q += " lgbt";
        // }

        if (answers.has("Asylum seeker")) {
            q += " refugee";
        }

        if (answers.has("Have a disability")) {
            q += " disability";
        }

        if (answers.has("Have children")) {
            q += " family";
        }

        if (answers.has("Have pets")) {
            q += " pets";
        }

        if (answers.has("On parole or recently released from prison")) {
            q += " parole";
        }

        request.q = q;

        return request;
    }
}

export default {
    Demographics: Demographics,
    Gender: Gender,
    Age: Age,
    HousingSubcategories: HousingSubcategories,
    SleepTonight: SleepTonight,
};
