/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { SearchByMap } from "./mixins";

var questions = {
    "Aboriginal or Torres Strait Islander": "indigenous",
    "LGBTIQ": "", // "lgbt" doesn't work in ISS
    "Asylum seeker": "refugee",
    "Have a disability": "disability",
    "Have children": "family",
    "Have pets": "pets",
    "On parole or recently released from prison": "parole",
};

/*::`*/@SearchByMap(questions)/*::`;*/
export default class Demographics extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "demographics",
        question: "Do any of these apply to you?",
        answers: Object.keys(questions),
    };

}
