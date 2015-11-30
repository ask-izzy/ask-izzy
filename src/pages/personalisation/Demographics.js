/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append } from "./BaseQuestion";
import icons from "../../icons";

export default class Demographics extends BaseMultiQuestion {
    static title = "Personal";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "demographics",
        question: "Do any of these apply to you?",
        answers: {
            /* eslint-disable max-len */
            "Aboriginal": append("indigenous"),
            "Torres Strait Islander": append("indigenous"),
            "LGBTIQ": append("sexuality"),
            "Asylum seeker": append("refugee"),
            "Have a disability": append("disability"),
            "Have children": append("family"),
            "Have pets": append("pets"),
            "On parole or recently released": append("post-release"),
            "Veteran": append("veteran"),
            "Escaping family violence": append("family violence"),
            "Need an interpreter": append("interpreter"),
            "None of the above": append(""),
        },
        icons: {
            "Aboriginal": icons.DemographicAboriginal,
            "Torres Strait Islander": icons.DemographicTorresStrait,
            "LGBTIQ": icons.DemographicLgbtiq,
            "Asylum seeker": icons.DemographicRecentlyArrived,
            "Have a disability": icons.DemographicDisability,
            "Have children": icons.DemographicChildren,
            "Have pets": icons.DemographicPets,
            "On parole or recently released": icons.DemographicParole,
            "Veteran": icons.DemographicVeteran,
            "Escaping family violence": icons.DemographicFamilyViolence,
            "Need an interpreter": icons.DemographicNeedInterpreter,
        },
    };

}
