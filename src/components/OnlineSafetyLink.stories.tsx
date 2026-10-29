import type {ReactNode} from "react";
import React from "react";
import { action } from "@storybook/addon-actions";

import OnlineSafetyLink from "./OnlineSafetyLink";

export default {
    title: "App Components/LogoWithTextBox/OnlineSafetyLink",
    component: OnlineSafetyLink,
    args: {
        onClick: (action("clicked") as any),
    },
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <OnlineSafetyLink {...args} />;
};

export const Example: typeof Template = Template.bind({});
