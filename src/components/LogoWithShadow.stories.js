/* @flow */

import type {Node} from "React";
import React from "react";

import LogoWithShadow from "./LogoWithShadow";

export default {
    title: "Icons/LogoWithShadow",
    component: LogoWithShadow,
};

const Template = (args: Object): Node => {
    (Template.args: any); return <LogoWithShadow {...args} />;
};

export const Example: typeof Template = Template.bind({});
