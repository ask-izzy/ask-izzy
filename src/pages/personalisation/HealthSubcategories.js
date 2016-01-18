/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { remove } from "./BaseQuestion";

export default class HealthSubcategories extends BaseMultiQuestion {
    static title = "Health";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-health",
        question: "What sort of help do you need?",
        answers: {
            /* eslint-disable max-len */
            "Children": remove("(community health)").append({
                q: "health children",
            }),
            "Maternal & child health": remove("(community health)")
                .remove({healthcare_card_holders: true})
                .append("maternal child health"),
            "Hospital": remove("(community health)")
                .remove({healthcare_card_holders: true})
                .append("public hospitals"),
        },
    };
}
