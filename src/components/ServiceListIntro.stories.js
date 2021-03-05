/* @flow */

import React from "react";
import { action } from "@storybook/addon-actions";

import ServiceListIntro from "./ServiceListIntro";

export default {
    title: "App Components/BaseLogoWithTextBox/ServiceListIntro",
    component: ServiceListIntro,
    args: {
        onClick: action("clicked"),
    },
};

const Template = (args: Object) => <ServiceListIntro {...args} />;

export const Example = Template.bind({});