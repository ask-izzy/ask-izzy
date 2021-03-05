/* @flow */

import React from "react";
import { addRouter } from "../storybook/decorators";

import LimitedServicesBanner from "./LimitedServicesBanner";

export default {
    title: "App Components/LimitedServicesBanner",
    component: LimitedServicesBanner,
    decorators: [addRouter],
};

const Template = (args: Object) => <LimitedServicesBanner {...args} />;

export const Example = Template.bind({});
