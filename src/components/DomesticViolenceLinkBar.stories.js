/* @flow */

import type {Node} from "React";
import React from "react";

import DomesticViolenceLinkBar from "./DomesticViolenceLinkBar";

export default {
    title: "App Components/DomesticViolenceLinkBar",
    component: DomesticViolenceLinkBar,
};

const Template = (args: Object): Node => {
    (Template.args: any); return <DomesticViolenceLinkBar {...args} />;
};

export const Example: typeof Template = Template.bind({});
