/* @flow */

import type {Node} from "React";
import React from "react";

import Link from "./Link";
import { addRouter } from "../storybook/decorators";

export default {
    title: "Basic UI Components/Link",
    component: Link,
    decorators: [addRouter],
};

const Template = (args: Object): Node => {
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
