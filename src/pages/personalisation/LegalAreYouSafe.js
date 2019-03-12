/* @flow */

import LegalSubcategories from "./LegalSubcategories";
import AreYouSafe from "./AreYouSafe";

export default class LegalAreYouSafe extends AreYouSafe {
    static showPage(): boolean {
        return super.showPage() && LegalSubcategories.answer ===
            "Domestic & family violence issues";
    }
}
