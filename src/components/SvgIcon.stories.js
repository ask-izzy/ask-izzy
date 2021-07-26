/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import { action } from "@storybook/addon-actions";

import SvgIcon from "./SvgIcon";

export default {
    title: "Icons/SvgIcon",
    component: SvgIcon,
    args: {
        onClick: (action("clicked"): any),
    },
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <SvgIcon {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    viewBox: "0 0 100 100",
    children: (
        <rect width="100"
            height="100"
            rx="15"
        />
    ),
};
