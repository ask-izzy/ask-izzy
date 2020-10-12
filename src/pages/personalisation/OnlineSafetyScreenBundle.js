/* @flow */

import React from "react";

import OnlineSafetyScreen from "./OnlineSafetyScreen";

export default function(initialQuestion: React.ComponentType<any>) {
    return [
        initialQuestion,
        OnlineSafetyScreen,
    ]
}
