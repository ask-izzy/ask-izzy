/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import FilterResult from "./FilterResult";

export default {
    title: "Basic UI Components/Filter Results",
    component: FilterResult,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => <FilterResult {...args} />;

export const Example: typeof Template = Template.bind({});
Example.title = "Filter";
