/* @flow */

import type {Node} from "React";
import React from "react";

import BrandedFooter from "./BrandedFooter";
import { addRouter } from "../storybook/decorators";

export default {
    title: "App Components/BrandedFooter",
    component: BrandedFooter,
    decorators: [addRouter],
};

const Template = (args: Object): Node => {
    (Template.args: any); return <BrandedFooter {...args} />;
};

export const Basic: typeof Template = Template.bind({});
