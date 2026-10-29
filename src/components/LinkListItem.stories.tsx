import type {ReactNode} from "react";
import React from "react";
import { action } from "@storybook/addon-actions";

import LinkListItem from "./LinkListItem";

export default {
    title: "App Components/ListItem/LinkListItem",
    component: LinkListItem,
    args: {
        primaryText: "Primary Text",
        secondaryText: "Secondary text",
        onClick: (action("clicked") as any),
    },
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <LinkListItem {...args} />;
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
