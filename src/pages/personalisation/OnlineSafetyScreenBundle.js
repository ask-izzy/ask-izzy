/* @flow */
import * as React from "react";

import OnlineSafetyScreen from "./OnlineSafetyScreen";

export default function(
    initialQuestion: React.ComponentType<any>
): Array<any | React.ComponentType<any>> {
    return [
        initialQuestion,
        OnlineSafetyScreen,
    ]
}
