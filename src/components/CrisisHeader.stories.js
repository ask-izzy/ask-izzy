/* @flow */

import type {Node} from "React";
import React from "react";

import CrisisHeader from "./CrisisHeader";

export default {
    title: "App Components/Crisis Line/CrisisHeader",
    component: CrisisHeader,
};

const Template = (args: Object): Node => {
    (Template.args: any); return <CrisisHeader {...args} />;
};

export const Header: typeof Template = Template.bind({});
