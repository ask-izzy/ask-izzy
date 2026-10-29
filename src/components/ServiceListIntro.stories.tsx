import type {ReactNode} from "react";
import React from "react";
import { action } from "@storybook/addon-actions";

import ServiceListIntro from "./ServiceListIntro";

export default {
    title: "App Components/LogoWithTextBox/ServiceListIntro",
    component: ServiceListIntro,
    args: {
        onClick: (action("clicked") as any),
    },
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <ServiceListIntro {...args} />;
};

export const Example: typeof Template = Template.bind({});
