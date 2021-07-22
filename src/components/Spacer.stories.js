/* @flow */

import type {Node} from "React";
import React from "react";

import Spacer from "./Spacer";

export default {
    title: "Basic UI Components/Spacer",
    component: Spacer,
};

const Template = (args: Object): Node => {
    (Template.args: any); return <Spacer {...args} />;
};

export const Example: typeof Template = Template.bind({});
