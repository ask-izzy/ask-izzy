import type {ReactNode} from "react";
import React from "react";
import DebugModeOffSwitch from "./DebugModeOffSwitch";

export default {
    title: "Debug Components/DebugModeOffSwitch",
    component: DebugModeOffSwitch,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <DebugModeOffSwitch {...args} />;
};

export const Example: typeof Template = Template.bind({});
