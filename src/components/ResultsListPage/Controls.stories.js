/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import Controls from "./Controls";

export default {
    title: "Basic UI Components/Controls",
    component: Controls,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => <Controls {...args} />;

export const Example: typeof Template = Template.bind({});
Example.args = {
    orderByCallback: () => { },
};
