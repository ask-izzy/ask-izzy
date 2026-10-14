import type {ReactNode} from "react";
import React from "react";

import DomesticViolenceLinkBar from "./DomesticViolenceLinkBar";

export default {
    title: "App Components/DomesticViolenceLinkBar",
    component: DomesticViolenceLinkBar,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <DomesticViolenceLinkBar {...args} />;
};

export const Example: typeof Template = Template.bind({});
