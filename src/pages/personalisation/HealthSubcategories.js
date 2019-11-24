/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";
import { resetDfvOptions } from "../../utils";

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
            "Domestic & family violence": append("health (Family violence)")
                .remove("(community health)"),
            "Sexual assault": append("(sexual assault)")
                .remove("(community health)"),
            "Sexual health": specialist("(sexual health)"),
            "Dentist": specialist("dentistry"),
            "Problems with feet": specialist("podiatry"),
            "Eye care": specialist("optometry"),
            "Social & emotional wellbeing": specialist("(mental health)"),
            "Children": remove("(community health)")
                .append("health children"),
            "Maternal & child health": remove("(community health)")
                .remove({show_in_askizzy_health: true})
                .append("(maternal child health)"),
            "Hospital": remove("(community health)")
                .remove({show_in_askizzy_health: true})
                .append("(public hospital services)")
                .append("-pac")
                .append("-medicare"),
        },
    };

    componentDidMount(): void {
        if (super.componentDidMount) {
            super.componentDidMount();
        }

        resetDfvOptions();
    }
}
