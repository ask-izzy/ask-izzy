/* @flow */

import BaseQuestion from "./BaseQuestion";
import Location from "./Location";
import { append, housingCrisis } from "../../iss/Search";

export default class AreYouSafe extends BaseQuestion {
    static title = "Safety";

    static propTypes = BaseQuestion.propTypes;

    static defaultProps = {
        name: "are-you-safe",
        question: "Are you safe right now?",
        answers: {            
            "No": housingCrisis(() => Location.shouldInjectAccessPoints()),
            "I'm not sure": append(""),
            "Yes": append(""),
        },
    };
}
