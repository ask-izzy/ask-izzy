import React, {ReactNode} from "react";

import QuickExit from "@/src/components/QuickExit.js";


export default {
    title: "App Components/QuickExit",
    component: QuickExit
};

const Template = (args): ReactNode => {
    return <QuickExit {...args} />;
};

export const ExampleDefault = Template.bind({});
export const ExampleCustom = Template.bind({});
ExampleCustom.args = {
    redirectUri: "http://google.com",
    tooltip: "Test Tool tip",
    className: "button-container"
};
export const ExampleCustomFixedSize = Template.bind({});
ExampleCustomFixedSize.args = {
    redirectUri: "http://google.com",
    tooltip: "Test Tool tip Fixed Size",
    fixedSize: true
};