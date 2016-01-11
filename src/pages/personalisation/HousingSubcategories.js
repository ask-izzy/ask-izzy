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
            "On the street":
                remove("housing -(respite care)")
                .remove("-(housing information) -hef")
                .append("crisis accommodation iap"),
            "Couch surfing":
                remove("housing")
                .append("homeless accommodation iap"),
            "In a rooming house": remove("housing -(respite care)")
                .remove("-(housing information) -hef")
                .append("community housing -(rooming house)"),
            "Private rental": remove("housing -(respite care)")
                .remove("-(housing information) -hef")
                .append("transitional accommodation"),
            "Public housing": remove("housing -(respite care)")
                .remove("-(housing information) -hef")
                .append("social housing ")
                .append("-(public rental) -(public housing)"),
            "Mortgaged housing": remove("housing -(respite care)")
                .remove("-(housing information) -hef")
                .append("transitional accommodation"),
        },
    };

    static showQuestion() {
        /* only show this question if the user has someone to sleep tonight */
        return (SleepTonight.answer != "No");
    }
}
