/* @flow */

import type {Node as ReactNode} from "React";
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

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <AppBar {...args} />;
};

export const Basic: typeof Template = Template.bind({});

export const LabeledBack: typeof Template = Template.bind({});
LabeledBack.args = {
    backMessage: "Go Back",
};
