/* @flow */

import React from "react";
import { addRouter } from "../storybook/decorators";

import BrandedFooter from "./BrandedFooter";

export default {
    title: "App Components/BrandedFooter",
    component: BrandedFooter,
    decorators: [addRouter],
};

const Template = (args: Object) => <BrandedFooter {...args} />;

export const Basic = Template.bind({});
