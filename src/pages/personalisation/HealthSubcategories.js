/* @flow */

import BaseQuestion, { remove, append } from "./BaseQuestion";

export default class HealthSubcategories extends BaseQuestion {
    static title = "Health";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-health",
        question: "What sort of help do you need?",
        answers: {
            /* eslint-disable max-len */
            "Doctor or nurse": append("doctor")
                .append("nurse"),
            "Children": remove("(community health)").append({
                q: "health children",
            }),
            "Maternal & child health": remove("(community health)")
                .remove({healthcare_card_holders: true})
                .append("maternal child health"),
            "Hospital": remove("(community health)")
                .remove({healthcare_card_holders: true})
                .append("(public hospitals)")
                .append("-medicare"),
        },
    };
}
