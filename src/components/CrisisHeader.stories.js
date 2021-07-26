/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import CrisisHeader from "./CrisisHeader";

export default {
    title: "App Components/Crisis Line/CrisisHeader",
    component: CrisisHeader,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <CrisisHeader {...args} />;
};

export const Header: typeof Template = Template.bind({});
