import type {ReactNode} from "react";
import React from "react";

import QuickExit from "./QuickExit";

export default {
    title: "App Components/QuickExit",
    component: QuickExit,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <QuickExit {...args} />;
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



