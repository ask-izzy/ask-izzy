/* @flow */

import SleepTonight from "./SleepTonight";
import BaseQuestion, { append, remove } from "./BaseQuestion";

export default class HousingSubcategories extends BaseQuestion {
    static title = "Housing";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-housing",
        question: "Which situation is most like yours?",
        answers: {
            "On the street": append("homeless"),
            "Couch surfing": append("homeless"),
            "In a rooming house": remove("housing -(respite care)")
                .remove("-(housing information) -hef")
                .append("community housing"),
            "Private rental": remove("housing -(respite care)")
                .remove("-(housing information) -hef")
                .remove("service_type:"housing")
                .append("transitional accommodation"),
            "Public housing": remove("housing -(respite care)")
                .remove("-(housing information) -hef")
                .remove("service_type:"housing")
                .append("social housing"),
            "Mortgaged housing": remove("housing -(respite care)")
                .remove("-(housing information) -hef")
                .remove("service_type:"housing")
                .append("transitional accommodation"),
        },
    };

    static showQuestion() {
        /* only show this question if the user has someone to sleep tonight */
        return (SleepTonight.answer != "No");
    }
}
