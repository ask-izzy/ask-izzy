/* @flow */

import HealthSubcategories from "./HealthSubcategories";
import BaseQuestion from "./BaseQuestion";
import {defaultProps} from "./AreYouSafe";
import type {
    PersonalisationPageDefaultProps,
} from "../../utils/personalisation";

export default class HealthAreYouSafe extends BaseQuestion {
    static defaultProps: PersonalisationPageDefaultProps = defaultProps;

    static title: string = "Are you safe";

    static showInSummary(): boolean {
        return false;
    }

    static staticShowPage(): boolean {
        return true;
    }

    static showPage(): boolean {
        return super.showPage() && HealthSubcategories.savedAnswer ===
            "Domestic & family violence";
    }
}
