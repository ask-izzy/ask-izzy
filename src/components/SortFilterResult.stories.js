/* @flow */

import React from "react";
import SortFilterResult from "./SortFilterResult";

export default {
    title: "Basic UI Components/Sort and Filter results container",
    component: SortFilterResult,
    argTypes: {},
};

const Template = (args: Object) => <SortFilterResult {...args} />;

export const Example = Template.bind({});
