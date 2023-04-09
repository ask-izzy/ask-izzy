import React, {ReactNode} from "react";
import { action } from "@storybook/addon-actions";

import ServiceListIntro from "@/src/components/ServiceListIntro.js";


export default {
    title: "App Components/LogoWithTextBox/ServiceListIntro",
    component: ServiceListIntro,
    args: {
        onClick: (action("clicked") as any)
    }
};

const Template = (args): ReactNode => {
    return <ServiceListIntro {...args} />;
};

export const Example: typeof Template = Template.bind({});