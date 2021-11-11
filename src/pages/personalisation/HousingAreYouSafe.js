/* @flow */
import Demographics from "./Demographics";
import AreYouSafe from "./AreYouSafe";

export default class HousingAreYouSafe extends AreYouSafe {

    static staticShowPage(): boolean {
        return true;
    }

    static showPage(): boolean {
        return Boolean(super.showPage() && Demographics.savedAnswer &&
            Demographics.savedAnswer.indexOf("Escaping family violence") > -1);
    }
}
