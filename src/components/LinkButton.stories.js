/* @flow */

import React from "react";

import LinkButton from "./LinkButton";

export default {
    title: "Basic UI Components/LinkButton",
    component: LinkButton,
};

const Template = (args: Object) => <LinkButton {...args} />;

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
