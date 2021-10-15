/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import SortResult from "./SortResult";

export default {
    title: "Basic UI Components/Sort Results",
    component: SortResult,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => <SortResult {...args} />;

export const Example: typeof Template = Template.bind({});
Example.title = "Test";
