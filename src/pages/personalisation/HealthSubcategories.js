/* @flow */

import BaseQuestion, { remove } from "./BaseQuestion";

export default class HealthSubcategories extends BaseQuestion {
    static title = "Health";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-health",
        question: "What sort of help do you need?",
        answers: {
            /* eslint-disable max-len */
            "Children": remove("community").append({
                q: "children",
                healthcare_card_holders: true,
            }),
            "Maternal & child health": remove("community health")
                .append("maternal child health"),
            "Hospital": remove("community health").append("public hospitals"),
        },
    };
}
