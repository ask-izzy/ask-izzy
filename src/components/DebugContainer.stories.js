/* @flow */

import React from "react";

import DebugContainer from "./DebugContainer";
import { addRouter, setDebugModeContext } from "../storybook/decorators";

export default {
    title: "App Components/Debug/DebugContainer",
    component: DebugContainer,
    decorators: [addRouter, setDebugModeContext],
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
