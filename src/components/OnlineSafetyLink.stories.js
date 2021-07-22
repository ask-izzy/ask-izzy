/* @flow */

import type {Node} from "React";
import React from "react";
import { action } from "@storybook/addon-actions";

import OnlineSafetyLink from "./OnlineSafetyLink";

export default {
    title: "App Components/BaseLogoWithTextBox/OnlineSafetyLink",
    component: OnlineSafetyLink,
    args: {
        onClick: (action("clicked"): any),
    },
};

const Template = (args: Object): Node => {
    (Template.args: any); return <OnlineSafetyLink {...args} />;
};

export const Example: typeof Template = Template.bind({});
