import type {ReactNode} from "react";
import React from "react";

import Web from "./Web";

export default {
    title: "Service Components/Web",
    component: Web,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <Web {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    url: "https://example.com/landingPage",
};
