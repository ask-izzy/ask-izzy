/* @flow */

import React from "react";

import QuickExit from "./QuickExit";

export default {
    title: "App Components/QuickExit",
    component: QuickExit,
};

const Template = (args: Object) => <QuickExit {...args} />;

export const ExampleDefault = Template.bind({});

export const ExampleCustom = Template.bind({});
ExampleCustom.args = {
    redirectUri: "http://google.com",
    tooltip: "Test Tool tip",
    className: "button-container",
};

export const ExampleCustomFixedSize = Template.bind({});
ExampleCustomFixedSize.args = {
    redirectUri: "http://google.com",
    tooltip: "Test Tool tip Fixed Size",
    fixedSize: true,
};



