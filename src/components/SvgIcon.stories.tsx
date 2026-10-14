import type {ReactNode} from "react";
import React from "react";
import { action } from "@storybook/addon-actions";

import SvgIcon from "./SvgIcon";

export default {
    title: "Icons/SvgIcon",
    component: SvgIcon,
    args: {
        onClick: (action("clicked") as any),
    },
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <SvgIcon {...args} />;
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
