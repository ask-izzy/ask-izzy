/* @flow */

import Demographics from "./Demographics";
import AreYouSafe from "./AreYouSafe";

export default class HousingAreYouSafe extends AreYouSafe {
    static showPage(): boolean {
        return super.showPage() && Boolean(Demographics.answer) &&
            Demographics.answer.indexOf("Escaping family violence") > -1;
    }
}
