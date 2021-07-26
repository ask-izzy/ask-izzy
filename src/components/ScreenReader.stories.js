/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import ScreenReader from "./ScreenReader";

export default {
    title: "Basic UI Components/ScreenReader",
    component: ScreenReader,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ScreenReader {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    children: (
        <div>Screen reader content</div>
    ),
};
