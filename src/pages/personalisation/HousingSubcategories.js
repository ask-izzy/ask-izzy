/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
import SleepTonight from "./SleepTonight";
import Location from "./Location";
import { remove, housingCrisis } from "../../iss/ServiceSearchRequest";

export default class HousingSubcategories extends BaseQuestion {
    static title: string = "Situation";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "sub-housing",
        question: "Which situation is most like yours?",
        possibleAnswers: {
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

    static getShouldIncludePage(): boolean {
        /* only show this question if the user has someone to sleep tonight */
        return (SleepTonight.savedAnswer !== "No");
    }
}
