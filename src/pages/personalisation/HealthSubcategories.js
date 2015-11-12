/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append, remove } from "./BaseQuestion";

export default class HealthSubcategories extends BaseMultiQuestion {
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-health",
        question: "What sort of help do you need?",
        answers: {
            /* eslint-disable max-len */
            "Doctor or nurse": remove("health").append({
                q: "doctor",
                healthcare_card_holders: true,
            }),
            "Children": append({
                q: "children",
                healthcare_card_holders: true,
            }),
            "Maternal & child health": append("maternal child health"),
            "Sexual health": remove("physical").append({
                q: "sexual health",
                healthcare_card_holders: true,
            }),
            "Dentist": remove("health").append({
                q: "dentist",
                healthcare_card_holders: true,
            }),
            "Foot problems": remove("physical health").append({
                q: "podiatrist",
                healthcare_card_holders: true,
            }),
            "Mental or emotional health e.g. depression": append({
                q: "mental health",
                healthcare_card_holders: true,
            }),
            "Hospital": remove("health").append("hospital"),
        },
    };
}
