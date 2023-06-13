import React, {ReactNode} from "react";
import { action } from "@storybook/addon-actions";

import AppBar from "@/src/components/AppBar.js";

export default {
    title: "App Components/AppBar",
    component: AppBar,
    args: {
        onBackTouchTap: (action("clickedBack") as any)
    }
};

const Template = (args): ReactNode => {
    return <AppBar {...args} />;
};

export const Basic = Template.bind({});
export const LabeledBack = Template.bind({});
LabeledBack.args = {
    backMessage: "Go Back"
};