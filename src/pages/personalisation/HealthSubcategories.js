/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append, remove } from "./BaseQuestion";

export default class HealthSubcategories extends BaseMultiQuestion {
    static title = "Health";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "sub-health",
        question: "What sort of help do you need?",
        answers: {
            /* eslint-disable max-len */
            "Doctor or nurse": remove("community health").append({
                q: "doctor nurse (community health)",
                healthcare_card_holders: true,
            }),
            "Children": remove("community").append({
                q: "children",
                healthcare_card_holders: true,
            }),
            "Maternal & child health": remove("community health")
                .append("maternal child health"),
            "Sexual health": remove("community health").append({
                q: "sexual health",
                healthcare_card_holders: true,
            }),
            "Dentist": remove("community health").append({
                q: "dentist",
                healthcare_card_holders: true,
            }),
            "Foot problems": remove("community health").append({
                q: "podiatrist",
                healthcare_card_holders: true,
            }),
            "Eye Care": remove("community health").append({
                q: "optometrist",
                healthcare_card_holders: true,
            }),
            "Mental or emotional health": remove("community health").append({
                q: "mental health",
                healthcare_card_holders: true,
            }),
            "Hospital": remove("community health").append("public hospitals"),
        },
    };
}
