/* @flow */

import BaseMultiQuestion from "./BaseMultiQuestion";

import { pull as lodashPull} from "lodash";

import { append } from "../../iss/Search";
import icons from "../../icons";

import Demographics from "./Demographics";
import storage from "../../storage";

export default class DfvDemographics extends BaseMultiQuestion {
    static title = "Personal";
    static propTypes = BaseMultiQuestion.propTypes;
    static defaultProps = {
        name: "dfv-demographics",
        question: "Do any of these apply to you?",
        answers: {
            "Aboriginal and/or Torres Strait Islander":
                append("(Aboriginals & Torres Strait Islanders)"),
            "Experiencing violence": append(""),
            "Under 18": append(""),
            "LGBTIQA+": append(""),
            "Culturally and linguistically diverse": append("ethnic"),
            "Person seeking asylum": append("refugees"),
            "Using violence": append(""),
        },
        icons: {
            "Aboriginal and/or Torres Strait Islander": icons.DemographicAtsi,
            "Experiencing violence": icons.ExperiencingViolence,
            "Under 18": icons.Under18,
            "LGBTIQA+": icons.DemographicLgbtiq,
            "Culturally and linguistically diverse":
                icons.DemographicNeedInterpreter,
            "Person seeking asylum": icons.DemographicRecentlyArrived,
            "Using violence": icons.UsingViolence,
        },
        oldAnswers: {},
    };

    onAnswerTouchTap(answer: string, enabled: boolean): void {
        super.onAnswerTouchTap(answer, enabled);

        /**
         * Since this component has some similar options to the regular
         * demographics we want to make sure that we keep those values in sync
         * so that a user doesn't need to tick the boxes twice.
         */
        // eslint-disable-next-line max-len
        if (Object.keys(Demographics.defaultProps.answers).indexOf(answer) > -1) {
            let demographicsAnswers = storage.getJSON(
                Demographics.defaultProps.name
            ) || [];

            if (enabled) {
                demographicsAnswers.push(answer);
            } else {
                lodashPull(demographicsAnswers, answer);
            }

            storage.setJSON(
                Demographics.defaultProps.name,
                demographicsAnswers
            );
        }
    }
}
