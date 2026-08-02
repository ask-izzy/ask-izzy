/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import SocialMedia from "./SocialMedia";

export default {
    title: "Service Components/SocialMedia",
    component: SocialMedia,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <SocialMedia {...args} />;
};

export const TwitterX: typeof Template = Template.bind({});
TwitterX.args = {
    type: "twitter",
    url: "https://x.com/askizzy",
};

export const LinkedIn: typeof Template = Template.bind({});
LinkedIn.args = {
    type: "linkedin",
    url: "https://linkedin.com/company/askizzy",
};

export const UnknownPlatform: typeof Template = Template.bind({});
UnknownPlatform.args = {
    type: "mastodon",
    url: "https://mastodon.social/@askizzy",
};