/* @flow */

import SleepTonight from "./SleepTonight";
import BaseQuestion, { remove } from "./BaseQuestion";

export default class HousingSubcategories extends BaseQuestion {
    static title = "Situation";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-housing",
        question: "Which situation is most like yours?",
        answers: {
            "On the street": remove("housing")
                .append("crisis accommodation"),
            "Couch surfing": remove("housing")
                .append("homeless accommodation"),
            "In a rooming house": remove("housing")
                .append("community housing -(rooming house)"),
            "Private rental": remove("housing")
                .append("transitional accommodation"),
            "Public housing": remove("housing")
                .append("social housing")
                .append("-(public rental)")
                .append("-(public housing)"),
            "Mortgaged housing": remove("housing")
                .append("transitional accommodation"),
        },
    };

    static showQuestion() {
        /* only show this question if the user has someone to sleep tonight */
        return (SleepTonight.answer != "No");
    }
}
