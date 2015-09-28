/* @flow */

import BaseQuestion from "./BaseQuestion";

// Can't see a way to cross-reference static properties :/
var ageGroups = {
    "25 or younger": [
        "prenatal",
        "baby",
        "toddler",
        "preschool",
        "schoolage",
        "earlyadolescent",
        "midadolescent",
        "lateadolescent",
        "youngadult",
    ],
    "26 to 64": [
        "adult",
        "middleageadult",
    ],
    "65 or older": [
        "preretirementage",
        "agedpersons",
    ],
};

export default class Age extends BaseQuestion {

    // flow:disable
    static ageGroups = ageGroups;

    // flow:disable
    static defaultProps = {
        name: "age",
        question: "How old are you?",
        answers: Object.keys(ageGroups),
    };

    static getSearchForAnswer(request, answer) {
        request.age_groups = ageGroups[answer];
        return request;
    }

    // flow:disable
    static get headingValue() {
        return `aged ${this.answer}`;
    }
}
