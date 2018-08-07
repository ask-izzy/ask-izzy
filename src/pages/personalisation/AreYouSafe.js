/* @flow */

import BaseQuestion from "./BaseQuestion";
<<<<<<< HEAD
import { append } from "../../iss/Search";
import icons from "../../icons";
=======
import Location from "./Location";
import { append, housingCrisis } from "../../iss/Search";
>>>>>>> Link to AreYouSafe after clicking violence category

export default class AreYouSafe extends BaseQuestion {
    static title = "Safety";

    static propTypes = BaseQuestion.propTypes;

    static defaultProps = {
        name: "are-you-safe",
        question: "Are you safe right now?",
<<<<<<< HEAD
<<<<<<< HEAD
        byline:
            "All of your answers are private and anonymous",
        answers: {
            "No": append(""),
            "I'm not sure": append(""),
            "Yes": append(""),
        },
        icons: {
            "No": icons.EscapeViolence,
            "I'm not sure": icons.Mental,
            "Yes": icons.House,
        },
        showOnlineSafetyLink: true,
    };

=======
        answers: {            
=======
        answers: {
>>>>>>> fix lint error
            "No": housingCrisis(() => Location.shouldInjectAccessPoints()),
            "I'm not sure": append(""),
            "Yes": append(""),
        },
    };
>>>>>>> Link to AreYouSafe after clicking violence category
}
