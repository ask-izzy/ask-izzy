/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

export default class Demographics extends BaseMultiQuestion {
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
        var q;

        if (!request.q) {
            // flow needs to be sure request.q exists
            throw new Error("Unexpected");
        } else {
            q = request.q;
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
