/* @flow */

import BaseQuestion from "./BaseQuestion";
import SleepTonight from "./SleepTonight";
import Location from "./Location";
import { remove, housingCrisis } from "../../iss/Search";

export default class HousingSubcategories extends BaseQuestion {
    static title = "Situation";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-housing",
        question: "What kind of support do you need?",
        answers: {
            "Somewhere to sleep tonight": remove("housing")
                .append("homeless accommodation"),
            "Help finding a place to live long term": remove("housing")
                .append("community housing -(rooming house)"),
        },
    };

    static showPage(): boolean {
        /* only show this question if the user has someone to sleep tonight */
        return (SleepTonight.answer != "No");
    }
}
