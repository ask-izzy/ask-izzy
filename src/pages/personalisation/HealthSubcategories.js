/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";

export default class HealthSubcategories extends BaseQuestion {
    static title = "Health";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-health",
        question: "What sort of help do you need?",
        answers: {
            "Doctor or nurse": append("(general medical practitioners)")
                .append("nurse"),
            "Sexual health": append("(sexual health)"),
            "Dentist": append("dentist"),
            "Foot problems": append("podiatrist"),
            "Eye care": append("optometrist"),
            "Mental": append("psychologist")
                .append("counselling"),
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
