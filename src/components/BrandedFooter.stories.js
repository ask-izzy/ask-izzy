/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import BrandedFooter from "./BrandedFooter";
import { addRouter } from "../storybook/decorators";

export default {
    title: "App Components/BrandedFooter",
    component: BrandedFooter,
    decorators: [addRouter],
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <BrandedFooter {...args} />;
};

export const Basic: typeof Template = Template.bind({});
