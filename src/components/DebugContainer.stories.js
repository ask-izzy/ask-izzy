/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import DebugContainer from "./DebugContainer";
import { setDebugModeContext } from "../storybook/decorators";

export default {
    title: "App Components/Debug/DebugContainer",
    component: DebugContainer,
    decorators: [setDebugModeContext],
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <DebugContainer {...args} />;
};

export const DebugModeEnabled: typeof Template = Template.bind({});
DebugModeEnabled.args = {
    message: "Debug Section Title",
    children: "Body Text",
};
DebugModeEnabled.parameters = {
    context: {
        debugMode: true,
    },
};

export const DebugModeDisabled: typeof Template = Template.bind({});
DebugModeDisabled.args = {
    message: "Debug Section Title",
    children: "Body Text",
};
