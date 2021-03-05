/* @flow */

import React, {useEffect} from "react";

import DebugContainer from "./DebugContainer";
import storage from "../storage";

export default {
    title: "App Components/Debug/DebugContainer",
    component: DebugContainer,
    decorators: [
        (Story: Object, {parameters}: Object) => {
            const debugMode = parameters?.context?.debugMode
            storage.setDebug(debugMode || false)
            useEffect(() => () => storage.setDebug(false))
            return <Story/>
        },
    ],
};

const Template = (args: Object) => <DebugContainer {...args} />;

export const DebugModeEnabled = Template.bind({});
DebugModeEnabled.args = {
    message: "Debug Section Title",
    children: "Body Text",
};
DebugModeEnabled.parameters = {
    context: {
        debugMode: true,
    },
};

export const DebugModeDisabled = Template.bind({});
DebugModeDisabled.args = {
    message: "Debug Section Title",
    children: "Body Text",
};
