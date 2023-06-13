import React, {ReactNode} from "react";

import DebugContainer from "@/src/components/DebugContainer.js";
import {setDebugModeContext } from "@/src/storybook/decorators.js";

export default {
    title: "App Components/Debug/DebugContainer",
    component: DebugContainer,
    decorators: [setDebugModeContext]
};

const Template = (args): ReactNode => {
    return <DebugContainer {...args} />;
};

export const DebugModeEnabled = Template.bind({});
DebugModeEnabled.args = {
    message: "Debug Section Title",
    children: "Body Text"
};
DebugModeEnabled.parameters = {
    context: {
        debugMode: true
    }
};
export const DebugModeDisabled = Template.bind({});
DebugModeDisabled.args = {
    message: "Debug Section Title",
    children: "Body Text"
};