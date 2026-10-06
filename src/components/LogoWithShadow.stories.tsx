import type {ReactNode} from "react";
import React from "react";

import LogoWithShadow from "./LogoWithShadow";

export default {
    title: "Icons/LogoWithShadow",
    component: LogoWithShadow,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <LogoWithShadow {...args} />;
};

export const Example: typeof Template = Template.bind({});
