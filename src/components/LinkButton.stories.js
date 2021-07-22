/* @flow */

import type {Node} from "React";
import React from "react";

import LinkButton from "./LinkButton";

export default {
    title: "Basic UI Components/LinkButton",
    component: LinkButton,
};

const Template = (args: Object): Node => {
    (Template.args: any); return <LinkButton {...args} />;
};

export const InternalLink: typeof Template = Template.bind({});
InternalLink.args = {
    to: "/",
    children: "Example Button",
};

export const ExternalLink: typeof Template = Template.bind({});
ExternalLink.args = {
    to: "https://example.com",
    children: "Example Button",
};
