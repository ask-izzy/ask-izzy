import type {ReactNode} from "react";
import React from "react";

import BoxedTextDivider from "./BoxedTextDivider";

export default {
    title: "Basic UI Components/BoxedText/BoxedTextDivider",
    component: BoxedTextDivider,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <BoxedTextDivider {...args} />;
};

export const Basic: typeof Template = Template.bind({});
