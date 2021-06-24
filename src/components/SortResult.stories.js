/* @flow */

import React from "react";
import SortResult from "./SortResult";

export default {
    title: "Basic UI Components/Sort Results",
    component: SortResult,
    argTypes: {},
};

const Template = (args: Object) => <SortResult {...args} />;

export const Example = Template.bind({});
Example.title = "Test";
