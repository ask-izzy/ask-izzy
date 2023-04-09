import React, {ReactNode} from "react";
import { action } from "@storybook/addon-actions";

import ProgressBar from "@/src/components/general/ProgressBar.js";


export default {
    title: "General Components/ProgressBar",
    component: ProgressBar,
    args: {
        onClick: (action("clicked") as any)
    }
}

const Template = (args): ReactNode => {
    return <ProgressBar {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    current: 1,
    total: 3
};