import React, {ReactNode} from "react";
import { action } from "@storybook/addon-actions";

import IconButton from "@/src/components/IconButton.js";


export default {
    title: "Basic UI Components/IconButton",
    component: IconButton,
    args: {
        onClick: (action("clicked") as any)
    }
};

const Template = (args): ReactNode => {
    return <IconButton {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    children: "Button Text"
};