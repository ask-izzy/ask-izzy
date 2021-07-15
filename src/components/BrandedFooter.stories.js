/* @flow */

import React from "react";

import BrandedFooter from "./BrandedFooter";
import { addRouter } from "../storybook/decorators";

export default {
    title: "App Components/BrandedFooter",
    component: BrandedFooter,
    decorators: [addRouter],
};

const Template = (args: Object) => <BrandedFooter {...args} />;

export const Basic = Template.bind({});
