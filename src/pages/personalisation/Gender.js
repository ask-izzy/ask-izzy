/* @flow */

import BaseQuestion from "./BaseQuestion";

export default class Gender extends BaseQuestion {
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

    // flow:disable
    static get headingValue() {
        switch (this.answer) {
        case "Male":
            return "for men";
        case "Female":
            return "for women";
        default:
            // important to not return "" here because it will
            // be followed by the age string and otherwise would
            // say "42 services aged 26 or younger"
            return "for people";
        }
    }
}
