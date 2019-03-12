/* @flow */

import HealthSubcategories from "./HealthSubcategories";
import AreYouSafe from "./AreYouSafe";

export default class HealthAreYouSafe extends AreYouSafe {
    static showPage(): boolean {
        return super.showPage() && HealthSubcategories.answer ===
            "Domestic & family violence";
    }
}
