import React, {ReactNode} from "react";
import { action } from "@storybook/addon-actions";

import SvgIcon from "@/src/components/SvgIcon.js";


export default {
    title: "Icons/SvgIcon",
    component: SvgIcon,
    args: {
        onClick: (action("clicked") as any)
    }
};

const Template = (args): ReactNode => {
    return <SvgIcon {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    viewBox: "0 0 100 100",
    children: (
        <rect
            width="100"
            height="100"
            rx="15"
        />
    )
};