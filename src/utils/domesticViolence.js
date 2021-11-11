/* @flow */

import storage from "../storage";

import AreYouSafe from "../pages/personalisation/AreYouSafe";
import OnlineSafetyScreen from "../pages/personalisation/OnlineSafetyScreen";

export const resetDfvOptions = (): void => {
    if (
        ["No", "I'm not sure"].includes(
            AreYouSafe.savedAnswer
        ) &&
        !OnlineSafetyScreen.savedAnswer
    ) {
        storage.removeItem(AreYouSafe.defaultProps.name);
    }
}
