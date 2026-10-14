import type {ReactNode} from "react";
import React from "react";

import Spacer from "./Spacer";

export default {
    title: "Basic UI Components/Spacer",
    component: Spacer,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <Spacer {...args} />;
};

export const Example: typeof Template = Template.bind({});
