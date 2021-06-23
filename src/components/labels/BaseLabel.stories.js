/* @flow */

import React from "react";
import BaseLabel from "./BaseLabel";

export default {
    title: "Basic UI Components/Labels/BaseLabel",
    component: BaseLabel,
    argTypes: {},
};

const Template = (args: Object) => <BaseLabel {...args} />;

export const Example = Template.bind({});
Example.labelText = "Test";
