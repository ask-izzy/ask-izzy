import type {ReactNode} from "react";
import React from "react";

import ScreenReader from "./ScreenReader";

export default {
    title: "Basic UI Components/ScreenReader",
    component: ScreenReader,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <ScreenReader {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    children: (
        <div>Screen reader content</div>
    ),
};
