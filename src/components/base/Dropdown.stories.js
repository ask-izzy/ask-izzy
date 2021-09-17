/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import Dropdown from "./Dropdown";

export default {
    title: "Basic UI Components/Dropdown",
    component: Dropdown,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => <Dropdown {...args} />;

export const Example: typeof Template = Template.bind({});
