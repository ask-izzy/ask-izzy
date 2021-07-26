/* @flow */
import AreYouSafe from "./AreYouSafe";
import storage from "../../storage";
import ViolenceKeywords from "../../constants/free-text-keywords";

export default class FreeTextAreYouSafe extends AreYouSafe {

    static staticShowPage(): boolean {
        return true;
    }

    static showPage(): boolean {
        const searchString = storage.getSearch();

        return super.showPage() &&
            ViolenceKeywords.indexOf(searchString.toLowerCase()) > -1;
    }
}
