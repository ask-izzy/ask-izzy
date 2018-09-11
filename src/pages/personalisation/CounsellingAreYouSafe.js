/* @flow */

import CounsellingSubcategories from "./CounsellingSubcategories";
import AreYouSafe from "./AreYouSafe";

export default class CounsellingAreYouSafe extends AreYouSafe {
    static showPage(): boolean {
        return CounsellingSubcategories.answer ===
            "Scared in my relationship";
    }
}
