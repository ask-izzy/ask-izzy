/* @flow */

import LegalSubcategories from "./LegalSubcategories";
import AreYouSafe from "./AreYouSafe";

export default class LegalAreYouSafe extends AreYouSafe {
    static showQuestion(): boolean {
        return LegalSubcategories.answer ===
            "Domestic & family violence issues";
    }
}
