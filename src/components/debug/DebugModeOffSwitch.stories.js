/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import DebugModeOffSwitch from "./DebugModeOffSwitch";

export default {
    title: "Debug Components/DebugModeOffSwitch",
    component: DebugModeOffSwitch,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <DebugModeOffSwitch {...args} />;
};

export const Example: typeof Template = Template.bind({});
