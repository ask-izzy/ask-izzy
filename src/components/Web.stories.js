/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import Web from "./Web";

export default {
    title: "Service Components/Web",
    component: Web,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <Web {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    url: "https://example.com/landingPage",
};
