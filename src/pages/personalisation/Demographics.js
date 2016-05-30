/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

import { append } from "../../iss/Search";
import icons from "../../icons";

export default class Demographics extends BaseMultiQuestion {
    static title = "Personal";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "demographics",
        question: "Do any of these apply to you?",
        answers: {
            "Escaping family violence": append("family violence"),
            "Indigenous": append("Aboriginals & Torres Strait Islanders"),
            "Family with children": append("families -srs"),
            "Couples": append("couples"),
            "Mental or emotional difficulties": append("mental health"),
            "Parole / recently released": append("post-release"),
            "Have a disability": append("disabilities"),
            "Veteran": append("veteran"),
            "Asylum seeker": append("refugees"),
            "Have pets": append("pets")
                .append("-effectiveness"),
        },
        icons: {
            "Escaping family violence": icons.DemographicFamilyViolence,
            "Indigenous": icons.DemographicAboriginal,
            "Family with children": icons.DemographicChildren,
            "Couples": icons.DemographicCouple,
            "Mental or emotional difficulties": icons.Mental,
            "Parole / recently released": icons.DemographicParole,
            "Have a disability": icons.DemographicDisability,
            "Veteran": icons.DemographicVeteran,
            "Asylum seeker": icons.DemographicRecentlyArrived,
            "Have pets": icons.DemographicPets,
        },
    };
}
