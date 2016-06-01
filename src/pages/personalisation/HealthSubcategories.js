/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";

function specialist(query) {
    return remove("(community health)").append(query);
}

export default class HealthSubcategories extends BaseQuestion {
    static title = "Health";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-health",
        question: "What sort of help do you need?",
        answers: {
            "Doctor": remove("(community health)")
                .append("(general medical practitioners)"),
            "Nurse": append("nurse"),
            "Sexual health": specialist("sexual health"),
            "Dentist": specialist("dentistry"),
            "Foot problems": specialist("podiatry"),
            "Eye care": specialist("optometry"),
            "Social & emotional wellbeing": specialist("mental health"),
            "Family": specialist("family"),
            "Children": remove("(community health)")
                .append("health children"),
            "Maternal & child health": remove("(community health)")
                .remove({healthcare_card_holders: true})
                .append("maternal child health"),
            "Hospital": remove("(community health)")
                .remove({healthcare_card_holders: true})
                .append("(public hospital services)")
                .append("-pac")
                .append("-medicare"),
        },
    };
}
