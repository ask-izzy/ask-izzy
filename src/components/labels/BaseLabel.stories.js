/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import BaseLabel from "./BaseLabel";

export default {
    title: "Basic UI Components/Labels/BaseLabel",
    component: BaseLabel,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => <BaseLabel {...args} />;

export const Example: typeof Template = Template.bind({});
Example.labelText = "Test";
