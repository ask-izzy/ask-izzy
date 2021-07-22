/* @flow */

import type {Node} from "React";
import React from "react";
import { action } from "@storybook/addon-actions";

import AppBar from "./AppBar";

export default {
    title: "App Components/AppBar",
    component: AppBar,
    args: {
        onBackTouchTap: (action("clickedBack"): any),
    },
};

const Template = (args: Object): Node => {
    (Template.args: any); return <AppBar {...args} />;
};

export const Basic: typeof Template = Template.bind({});
Basic.args = {
    title: "Page Title",
};

export const LabeledBack: typeof Template = Template.bind({});
LabeledBack.args = {
    title: "Page Title",
    backMessage: "Go Back",
};
