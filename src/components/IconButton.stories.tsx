import type {ReactNode} from "react";
import React from "react";
import { action } from "@storybook/addon-actions";

import IconButton from "./IconButton";

export default {
    title: "Basic UI Components/IconButton",
    component: IconButton,
    args: {
        onClick: (action("clicked") as any),
    },
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <IconButton {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    children: "Button Text",
};
