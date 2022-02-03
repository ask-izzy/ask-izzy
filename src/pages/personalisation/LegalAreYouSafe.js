/* @flow */
import LegalSubcategories from "./LegalSubcategories";
import BaseQuestion from "./BaseQuestion";
import {defaultProps as areYouSafeDefaultProps} from "./AreYouSafe";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation";

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    ...areYouSafeDefaultProps,
    noQuestionStepperStep: true,
};
export default class LegalAreYouSafe extends BaseQuestion {
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static title: string = "Are you safe";

    static getShouldShowInSummary(): boolean {
        return false;
    }

    static getShouldIncludePage(): boolean {
        return LegalSubcategories.savedAnswer ===
            "Domestic & family violence issues";
    }
}
