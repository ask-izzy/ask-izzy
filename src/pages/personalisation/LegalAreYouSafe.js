/* @flow */
import LegalSubcategories from "./LegalSubcategories";
import BaseQuestion from "./BaseQuestion";
import {defaultProps} from "./AreYouSafe";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation";

export default class LegalAreYouSafe extends BaseQuestion {
    static defaultProps: PersonalisationQuestionPageDefaultProps = {
        ...defaultProps,
        noQuestionStepperStep: true,
    };

    static title: string = "Are you safe";

    static getShouldShowInSummary(): boolean {
        return false;
    }

    static getShouldIncludePage(): boolean {
        return LegalSubcategories.savedAnswer ===
            "Domestic & family violence issues";
    }
}
