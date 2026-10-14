import type {ReactNode} from "react";
import React from "react";

import BrandedFooter from "./BrandedFooter";

export default {
    title: "App Components/BrandedFooter",
    component: BrandedFooter,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <BrandedFooter {...args} />;
};

export const Basic: typeof Template = Template.bind({});
