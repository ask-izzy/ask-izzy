/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

import { append } from "../../iss/Search";
import icons from "../../icons";

import { pull as lodashPull } from "lodash";
import DfvDemographics from "./DfvDemographics";
import storage from "../../storage";

export default class Demographics extends BaseMultiQuestion {
    static title = "Personal";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "demographics",
        question: "Do any of these apply to you?",
        answers: {
            "Escaping family violence": append("(family violence)"),
            // n.b. see also storage.getUserIsIndigenous when changing
            "Aboriginal and/or Torres Strait Islander":
                append("(Aboriginals & Torres Strait Islanders)"),
            "Family with children": append("families -srs"),
            "Couples": append("couples"),
            "Mental or emotional difficulties": append("(mental health)"),
            "Parole / recently released": append("post-release"),
            "Have a disability": append("disabilities"),
            "Veteran": append("veteran"),
            "Person seeking asylum": append("refugees"),
            "Have pets": append("pets")
                .append("-effectiveness"),
        },
        icons: {
            "Escaping family violence": icons.DemographicFamilyViolence,
            "Aboriginal and/or Torres Strait Islander": icons.DemographicAtsi,
            "Family with children": icons.DemographicChildren,
            "Couples": icons.DemographicCouple,
            "Mental or emotional difficulties": icons.Mental,
            "Parole / recently released": icons.DemographicParole,
            "Have a disability": icons.DemographicDisability,
            "Veteran": icons.DemographicVeteran,
            "Person seeking asylum": icons.DemographicRecentlyArrived,
            "Have pets": icons.DemographicPets,
        },
        oldAnswers: {
            "Indigenous": "Aboriginal and/or Torres Strait Islander",
            "Aboriginal": "Aboriginal and/or Torres Strait Islander",
        },
    };

    onAnswerTouchTap(answer: string, enabled: boolean): void {
        super.onAnswerTouchTap(answer, enabled);

        /**
         * This is the reverse of the function in DfvDemographics. If we update
         * an answer here we also want it to apply to DfvDemographics if it one
         * of the options available on that page.
         */
        // eslint-disable-next-line max-len
        if (Object.keys(DfvDemographics.defaultProps.answers).indexOf(answer) > -1) {
            let demographicsAnswers = storage.getJSON(
                DfvDemographics.defaultProps.name
            ) || [];

            if (enabled) {
                demographicsAnswers.push(answer);
            } else {
                lodashPull(demographicsAnswers, answer);
            }

            storage.setJSON(
                DfvDemographics.defaultProps.name,
                demographicsAnswers
            );
        }
    }
}
