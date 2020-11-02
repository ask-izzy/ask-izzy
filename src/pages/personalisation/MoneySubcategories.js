/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";

export default class MoneySubcategories extends BaseQuestion {
    static title = "Money help";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-money",
        question: "What kind of support do you need?",
        mandatory: true,
        answers: {
            /* eslint-disable max-len */
            "Centrelink": append("centrelink"),
            "Emergency aid": append("emergency -(coordinating bodies) -grants -heritage"),
            "Bond or rental assistance": append("(bond assistance) rent -(coordinating bodies) -grants -heritage")
                .append({ catchment: ["prefer"] }),
            "Financial assistance e.g. utility bills, petrol, food":
                append("(financial aid) -(coordinating bodies) -grants -heritage")
                .append({ service_type: ["financial aid"] }),
            "No interest & low interest loans":
                append("nils low-interest -(coordinating bodies) -grants -heritage"),
            "Gambling counselling":
                append("Gambling -(coordinating bodies) -grants -heritage"),
            "Financial counselling":
                append("financial -(coordinating bodies) -grants -heritage")
                .append({name: "financial counselling"}),
        },
    };
}
