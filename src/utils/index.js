/* @flow */

import storage from "../storage";

import AreYouSafe from "../pages/personalisation/AreYouSafe";
import OnlineSafetyScreen from "../pages/personalisation/OnlineSafetyScreen";

export const resetDfvOptions = (): void => {
    if (Boolean(AreYouSafe.answer) &&
        [
            "No",
            "I'm not sure",
        ].indexOf(AreYouSafe.answer) > -1 &&
        !OnlineSafetyScreen.answer) {
        storage.removeItem(AreYouSafe.defaultProps.name);
    }
}

export default {
    resetDfvOptions,
}

export function stateFromLocation(): string {
    const states = [
        "ACT",
        "NSW",
        "NT",
        "QLD",
        "SA",
        "TAS",
        "VIC",
        "WA",
    ];

    const location = storage.getLocation()
    const state = location.split(",").pop().trim()

    return states.includes(state) ? state : ""
}
