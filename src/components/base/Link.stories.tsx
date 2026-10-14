import type {ReactNode} from "react";
import React from "react";

import Link from "./Link";

export default {
    title: "Base Components/Link",
    component: Link,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <Link {...args} />;
};

export const InternalLink: typeof Template = Template.bind({});
InternalLink.args = {
    to: "/",
    children: "Example Internal Link",
};

export const ExternalLink: typeof Template = Template.bind({});
ExternalLink.args = {
    to: "https://google.com",
    children: "Example External Link",
};
