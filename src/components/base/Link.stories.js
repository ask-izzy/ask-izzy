/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import Link from "./Link";

export default {
    title: "Base Components/Link",
    component: Link,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <Link {...args} />;
};

export const InternalLink: typeof Template = Template.bind({});
InternalLink.args = {
    to: "/",
    children: "Example Button",
};

export const ExternalLink: typeof Template = Template.bind({});
ExternalLink.args = {
    to: "https://google.com",
    children: "Example Button",
};
