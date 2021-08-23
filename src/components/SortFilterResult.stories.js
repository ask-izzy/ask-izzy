/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import SortFilterResult from "./SortFilterResult";

export default {
    title: "Basic UI Components/Sort and Filter results container",
    component: SortFilterResult,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => <SortFilterResult {...args} />;

export const Example: typeof Template = Template.bind({});
