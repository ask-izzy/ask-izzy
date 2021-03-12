/* @flow */

import React from "react";
import { action } from "@storybook/addon-actions";

import IconButton from "./IconButton";

export default {
    title: "Basic UI Components/IconButton",
    component: IconButton,
    args: {
        onClick: action("clicked"),
    },
};

const Template = (args: Object) => <IconButton {...args} />;

export const Example = Template.bind({});
Example.args = {
    children: "Button Text",
};
