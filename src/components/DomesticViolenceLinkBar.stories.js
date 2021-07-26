/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import DomesticViolenceLinkBar from "./DomesticViolenceLinkBar";

export default {
    title: "App Components/DomesticViolenceLinkBar",
    component: DomesticViolenceLinkBar,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <DomesticViolenceLinkBar {...args} />;
};

export const Example: typeof Template = Template.bind({});
