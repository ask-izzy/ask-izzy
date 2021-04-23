/* @flow */

import React from "react";

import Link from "./Link";
import { addRouter } from "../storybook/decorators";

export default {
    title: "Basic UI Components/Link",
    component: Link,
    decorators: [addRouter],
};

const Template = (args: Object) => <Link {...args} />;

export const InternalLink = Template.bind({});
InternalLink.args = {
    to: "/",
    children: "Example Button",
};

export const ExternalLink = Template.bind({});
ExternalLink.args = {
    to: "https://google.com",
    children: "Example Button",
};
