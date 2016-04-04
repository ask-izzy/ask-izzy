/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";

export default class LegalSubcategories extends BaseQuestion {
    static title = "Legal";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-legal",
        question: "What's happening?",
        answers: {
            "Legal advice": remove("legal -permits -ceremonies")
                .remove("-making -checks -electoral -taxation")
                .remove("-centrelink -immigration -(hire of facilities)")
                .append("legal advice"),
            "Family violence": append("family violence -police"),
            "Victims of crime compensation": remove("legal -permits")
                .remove("-(coordinating bodies) -ceremonies -making")
                .remove("-checks -electoral -taxation")
                .remove("-centrelink -immigration -(hire of facilities)")
                .append("victims of crime -police"),
        },
    };
}
