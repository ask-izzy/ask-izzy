import React, {ReactNode} from "react";
import {action} from "@storybook/addon-actions";

import OnlineSafetyLink from "@/src/components/OnlineSafetyLink";

export default {
    title: "App Components/LogoWithTextBox/OnlineSafetyLink",
    component: OnlineSafetyLink,
    args: {
        onClick: (action("clicked") as any)
    }
};

const Template = (args): ReactNode => {
    return <OnlineSafetyLink {...args} />;
};

export const Example = Template.bind({});