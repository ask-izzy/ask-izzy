/* @flow */

import AreYouSafe from "./AreYouSafe";
import storage from "../../storage";

export default class FreeTextAreYouSafe extends AreYouSafe {
    static showPage(): boolean {
        const searchString = storage.getSearch();

        return super.showPage() &&
        [
            "domestic violence",
            "family violence",
            "elder abuse",
            "sexual abuse",
            "sexual violence",
            "child abuse",
            "violence",
            "abuse",
            "assault",
            "rape",
            "incest",
        ].indexOf(searchString.toLowerCase()) > -1;
    }
}
