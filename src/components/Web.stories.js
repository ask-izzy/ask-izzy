/* @flow */

import React from "react";

import Web from "./Web";

export default {
    title: "Service Components/Web",
    component: Web,
};

const Template = (args: Object) => <Web {...args} />;

export const Example = Template.bind({});
Example.args = {
    url: "https://example.com/landingPage",
};
