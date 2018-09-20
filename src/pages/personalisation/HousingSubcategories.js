/* @flow */

import BaseQuestion from "./BaseQuestion";
import SleepTonight from "./SleepTonight";
import Location from "./Location";
import { remove, housingCrisis } from "../../iss/Search";
import { resetDfvOptions } from "../../utils";

export default class HousingSubcategories extends BaseQuestion {
    static title = "Situation";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-housing",
        question: "Which situation is most like yours?",
        answers: {
            "On the street": housingCrisis(
                () => Location.shouldInjectAccessPoints()
            ),
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

    static showPage(): boolean {
        /* only show this question if the user has someone to sleep tonight */
        return (SleepTonight.answer != "No");
    }

    componentDidMount(): void {
        if (super.componentDidMount) {
            super.componentDidMount();
        }

        resetDfvOptions();
    }
}
