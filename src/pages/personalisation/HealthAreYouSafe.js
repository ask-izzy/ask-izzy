/* @flow */

import HealthSubcategories from "./HealthSubcategories";
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

export default class HealthAreYouSafe extends BaseQuestion {
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static title: string = "Are you safe";

    static getShouldShowInSummary(): boolean {
        return false;
    }

    static getShouldIncludePage(): boolean {
        return HealthSubcategories.savedAnswer ===
            "Domestic & family violence";
    }
}
