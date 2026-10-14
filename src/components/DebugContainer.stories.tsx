import type {ReactNode} from "react";
import React from "react";

import DebugContainer from "./DebugContainer";
import { setDebugModeContext } from "../storybook/decorators";

export default {
    title: "App Components/Debug/DebugContainer",
    component: DebugContainer,
    decorators: [setDebugModeContext],
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <DebugContainer {...args} />;
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
