/* @flow */

import React from "react";
import { action } from "@storybook/addon-actions";

import OnlineSafetyLink from "./OnlineSafetyLink";

export default {
    title: "App Components/BaseLogoWithTextBox/OnlineSafetyLink",
    component: OnlineSafetyLink,
    args: {
        onClick: action("clicked"),
    },
};

const Template = (args: Object) => <OnlineSafetyLink {...args} />;

export const Example = Template.bind({});