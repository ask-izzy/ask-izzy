/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import SleepTonight from "./SleepTonight";

// FIXME: This should use a more temporary
// store than the default SessionStore - should be cleared
// when going back to the category list.
export default class HousingSubcategories extends BaseMultiQuestion {
    // flow:disable
    static defaultProps = {
        name: "sub-housing",
        question: "Is this your situation?",
        answers: [
            "On the street",
            "Couch surfing",
            "In a rooming house",
            "Private rental",
            "Public housing",
            "Mortgaged housing",
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
        return (SleepTonight.answer == "Yes");
    }
}
