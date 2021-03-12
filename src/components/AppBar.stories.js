/* @flow */

import React from "react";
import { action } from "@storybook/addon-actions";

import AppBar from "./AppBar";

export default {
    title: "App Components/AppBar",
    component: AppBar,
    args: {
        onBackTouchTap: action("clickedBack"),
    },
};

const Template = (args: Object) => <AppBar {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    title: "Page Title",
};

export const LabeledBack = Template.bind({});
LabeledBack.args = {
    title: "Page Title",
    backMessage: "Go Back",
};