/* @flow */

import HealthSubcategories from "./HealthSubcategories";
import BaseQuestion from "./BaseQuestion";
import {defaultProps} from "./AreYouSafe";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation";

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
