/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import BrandedFooter from "./BrandedFooter";

export default {
    title: "App Components/BrandedFooter",
    component: BrandedFooter,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <BrandedFooter {...args} />;
};

export const Basic: typeof Template = Template.bind({});
