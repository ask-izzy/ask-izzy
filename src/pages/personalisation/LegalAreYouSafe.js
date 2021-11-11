/* @flow */
import LegalSubcategories from "./LegalSubcategories";
import AreYouSafe from "./AreYouSafe";

export default class LegalAreYouSafe extends AreYouSafe {

    static staticShowPage(): boolean {
        return true;
    }

    static showPage(): boolean {
        return super.showPage() && LegalSubcategories.savedAnswer ===
            "Domestic & family violence issues";
    }
}
