/* @flow */

import React from "react";

import ScreenReader from "./ScreenReader";

export default {
    title: "Basic UI Components/ScreenReader",
    component: ScreenReader,
};

const Template = (args: Object) => <ScreenReader {...args} />;

export const Example = Template.bind({});
Example.args = {
    children: (
        <div>Screen reader content</div>
    ),
};
