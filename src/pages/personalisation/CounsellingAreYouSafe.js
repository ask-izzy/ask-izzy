/* @flow */
import CounsellingSubcategories from "./CounsellingSubcategories";
import AreYouSafe from "./AreYouSafe";

export default class CounsellingAreYouSafe extends AreYouSafe {

    static staticShowPage(): boolean {
        return true;
    }

    static showPage(): boolean {
        return super.showPage() &&
            CounsellingSubcategories.answer === "Scared in my relationship";
    }
}
