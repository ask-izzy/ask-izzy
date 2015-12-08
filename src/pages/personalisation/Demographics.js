/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";
import { append } from "./BaseQuestion";
import icons from "../../icons";

console.log(icons.DemographicCouple);

export default class Demographics extends BaseMultiQuestion {
    static title = "Personal";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "demographics",
        question: "Do any of these apply to you?",
        answers: {
            /* eslint-disable max-len */
            "Indigenous": append("indigenous"),
            "Family with children": append("family"),
            "In a couple": append("couples"),
            "Parole / recently released": append("post-release"),
            "Have a disability": append("disability"),
            "Veteran": append("veteran"),
            "Asylum seeker": append("refugee"),
            "Have pets": append("pets"),
        },
        icons: {
            "Indigenous": icons.DemographicAboriginal,
            "Family with children": icons.DemographicChildren,
            "In a couple": icons.DemographicCouple,
            "Parole / recently released": icons.DemographicParole,
            "Have a disability": icons.DemographicDisability,
            "Veteran": icons.DemographicVeteran,
            "Asylum seeker": icons.DemographicRecentlyArrived,
            "Have pets": icons.DemographicPets,
        },
    };

}
