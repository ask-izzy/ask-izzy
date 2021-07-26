/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import { action } from "@storybook/addon-actions";

import IconButton from "./IconButton";

export default {
    title: "Basic UI Components/IconButton",
    component: IconButton,
    args: {
        onClick: (action("clicked"): any),
    },
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <IconButton {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    children: "Button Text",
};
