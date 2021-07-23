/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import QuickExit from "./QuickExit";

export default {
    title: "App Components/QuickExit",
    component: QuickExit,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <QuickExit {...args} />;
};

export const ExampleDefault: typeof Template = Template.bind({});

export const ExampleCustom: typeof Template = Template.bind({});
ExampleCustom.args = {
    redirectUri: "http://google.com",
    tooltip: "Test Tool tip",
    className: "button-container",
};

export const ExampleCustomFixedSize: typeof Template = Template.bind({});
ExampleCustomFixedSize.args = {
    redirectUri: "http://google.com",
    tooltip: "Test Tool tip Fixed Size",
    fixedSize: true,
};



