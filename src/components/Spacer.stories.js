/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import Spacer from "./Spacer";

export default {
    title: "Basic UI Components/Spacer",
    component: Spacer,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <Spacer {...args} />;
};

export const Example: typeof Template = Template.bind({});
