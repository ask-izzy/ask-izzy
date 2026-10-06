import type {ReactNode} from "react";
import React from "react";
import { action } from "@storybook/addon-actions";

import AppBar from "./AppBar";

export default {
    title: "App Components/AppBar",
    component: AppBar,
    args: {
        onBackTouchTap: (action("clickedBack") as any),
    },
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <AppBar {...args} />;
};

export const Basic: typeof Template = Template.bind({});

export const LabeledBack: typeof Template = Template.bind({});
LabeledBack.args = {
    backMessage: "Go Back",
};
