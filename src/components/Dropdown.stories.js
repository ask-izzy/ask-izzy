/* @flow */

import React from "react";
import Dropdown from "./Dropdown";

export default {
    title: "Basic UI Components/Dropdown",
    component: Dropdown,
    argTypes: {},
};

const Template = (args: Object) => <Dropdown {...args} />;

export const Example = Template.bind({});
