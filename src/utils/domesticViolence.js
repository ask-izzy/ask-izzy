/* @flow */

import storage from "../storage";

import AreYouSafe from "../constants/personalisation-pages/AreYouSafe";
import OnlineSafetyScreen from
    "../constants/personalisation-pages/OnlineSafetyScreen";
import {getSavedPersonalisationAnswer} from "./personalisation"

export const resetDfvOptions = (): void => {
    if (
        ["No", "I'm not sure"].includes(
            getSavedPersonalisationAnswer(AreYouSafe)
        ) &&
        !getSavedPersonalisationAnswer(OnlineSafetyScreen)
    ) {
        storage.removeItem(AreYouSafe.name);
    }
}
