/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import { addRouter } from "../storybook/decorators";
import { action } from "@storybook/addon-actions";

import LinkListItem from "./LinkListItem";

export default {
    title: "App Components/ListItem/LinkListItem",
    component: LinkListItem,
    args: {
        primaryText: "Primary Text",
        secondaryText: "Secondary text",
        onClick: (action("clicked"): any),
    },
    decorators: [addRouter],
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <LinkListItem {...args} />;
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
