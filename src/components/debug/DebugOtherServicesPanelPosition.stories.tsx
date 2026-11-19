import type {ReactNode} from "react";
import React from "react";
import DebugOtherServicesPanelPosition from "./DebugOtherServicesPanelPosition";

export default {
    title: "Debug Components/DebugOtherServicesPanelPosition",
    component: DebugOtherServicesPanelPosition,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <DebugOtherServicesPanelPosition {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    position: 4,
    setPosition: () => {},
};
