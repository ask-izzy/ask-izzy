/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import LogoWithShadow from "./LogoWithShadow";

export default {
    title: "Icons/LogoWithShadow",
    component: LogoWithShadow,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <LogoWithShadow {...args} />;
};

export const Example: typeof Template = Template.bind({});
