/* @flow */

import React from "react";
import FilterResult from "./FilterResult";

export default {
    title: "Basic UI Components/Filter Results",
    component: FilterResult,
    argTypes: {},
};

const Template = (args: Object) => <FilterResult {...args} />;

export const Example = Template.bind({});
Example.title = "Filter";
