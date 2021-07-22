/* @flow */

import type {Node} from "React";
import React from "react";

import Web from "./Web";

export default {
    title: "Service Components/Web",
    component: Web,
};

const Template = (args: Object): Node => {
    (Template.args: any); return <Web {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    url: "https://example.com/landingPage",
};
