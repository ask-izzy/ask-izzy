/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import BoxedTextDivider from "./BoxedTextDivider";

export default {
    title: "Basic UI Components/BoxedText/BoxedTextDivider",
    component: BoxedTextDivider,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <BoxedTextDivider {...args} />;
};

export const Basic: typeof Template = Template.bind({});
