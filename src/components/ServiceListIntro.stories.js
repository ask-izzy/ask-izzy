/* @flow */

import type {Node} from "React";
import React from "react";
import { action } from "@storybook/addon-actions";

import ServiceListIntro from "./ServiceListIntro";

export default {
    title: "App Components/BaseLogoWithTextBox/ServiceListIntro",
    component: ServiceListIntro,
    args: {
        onClick: (action("clicked"): any),
    },
};

const Template = (args: Object): Node => {
    (Template.args: any); return <ServiceListIntro {...args} />;
};

export const Example: typeof Template = Template.bind({});
