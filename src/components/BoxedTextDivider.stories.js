/* @flow */

import type {Node} from "React";
import React from "react";

import BoxedTextDivider from "./BoxedTextDivider";

export default {
    title: "Basic UI Components/BoxedText/BoxedTextDivider",
    component: BoxedTextDivider,
};

const Template = (args: Object): Node => {
    (Template.args: any); return <BoxedTextDivider {...args} />;
};

export const Basic: typeof Template = Template.bind({});
