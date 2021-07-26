/* @flow */

import type {Node as ReactNode} from "React";
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

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ServiceListIntro {...args} />;
};

export const Example: typeof Template = Template.bind({});
