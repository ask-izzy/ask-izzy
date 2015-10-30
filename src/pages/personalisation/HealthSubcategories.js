/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append, remove } from "./BaseQuestion";

export default class HealthSubcategories extends BaseMultiQuestion {
    static defaultProps = {
        name: "sub-health",
        question: "What sort of help do you need?",
        answers: {
            /* eslint-disable max-len */
            "Doctor or nurse": remove("health").append({
                q: "doctor",
                bulk_billing: true,
            }),
            "Children": append({
                q: "children",
                bulk_billing: true,
            }),
            "Maternal & child health": append("maternal child health"),
            "Sexual stuff": remove("physical").append({
                q: "sexual health",
                bulk_billing: true,
            }),
            "Dentist": remove("health").append("dentist health care card"),
            "Feet": remove("physical health").append({
                q: "podiatrist",
                bulk_billing: true,
            }),
            "Mental or emotional health e.g. depression": append({
                q: "mental health",
                bulk_billing: true,
            }),
            "Hospital": remove("health").append("hospital"),
        },
    };
}
