/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { remove, append } from "./BaseQuestion";

export default class HealthSubcategories extends BaseMultiQuestion {
    static title = "Health";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-health",
        question: "What sort of help do you need?",
        answers: {
            /* eslint-disable max-len */
            "Doctor or nurse": append("doctor")
                .append("nurse"),
            "Children": remove("(community health)")
                .append("health children"),
            "Maternal & child health": remove("(community health)")
                .append("maternal child health"),
            "Sexual health": remove("(community health)")
                .append("sexual health"),
            "Dentist": remove("(community health)")
                .append("dentist"),
            "Foot problems": remove("(community health)")
                .append("podiatrist"),
            "Eye Care": remove("(community health)")
                .append("optometrist"),
            "Mental or emotional health": remove("(community health)")
                .append("mental health"),
            "Hospital": remove("(community health)")
                .remove({healthcare_card_holders: true})
                .append("public hospitals"),
        },
    };
}
