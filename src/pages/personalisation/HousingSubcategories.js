/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";

export default class HousingSubcategories extends BaseQuestion {
    static title = "Situation";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-housing",
        question: "What kind of support do you need?",
        mandatory: true,
        answers: {
            "Somewhere to sleep tonight":
                append("(Homelessness Access Point) (Crisis accomodation)")
                .append({service_type: ["homeless access point"], catchment: true}),
            "Help finding a place to live long term":
                append("Housing -(coordinating bodies) -(housing information) -(respite care) -(holiday accommodation) -hef")
                .append({ service_type: ["housing"] }),
        },
    };
}
