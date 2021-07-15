/* @flow */

import storage from "../storage";

import AreYouSafe from "../pages/personalisation/AreYouSafe";
import OnlineSafetyScreen from "../pages/personalisation/OnlineSafetyScreen";

export const resetDfvOptions = (): void => {
    if (
        Boolean(AreYouSafe.answer) &&
        [
            "No",
            "I'm not sure",
        ].indexOf(AreYouSafe.answer) > -1 &&
        !OnlineSafetyScreen.answer
    ) {
        storage.removeItem(AreYouSafe.defaultProps.name);
    }
}