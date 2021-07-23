/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import OnlineSafetyContent from "./OnlineSafetyContent";

export default {
    title: "App Components/OnlineSafetyContent",
    component: OnlineSafetyContent,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <OnlineSafetyContent {...args} />;
};

export const Example: typeof Template = Template.bind({});
