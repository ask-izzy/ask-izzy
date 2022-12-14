import React, {ReactNode} from "react";
import {action} from "@storybook/addon-actions";

import LinkListItem from "@/src/components/LinkListItem";

export default {
    title: "App Components/ListItem/LinkListItem",
    component: LinkListItem,
    args: {
        primaryText: "Primary Text",
        secondaryText: "Secondary text",
        onClick: (action("clicked") as any)
    }
};

const Template = (args): ReactNode => {
    return <LinkListItem {...args} />;
};

export const InternalLink = Template.bind({});
InternalLink.args = {
    to: "/",
    children: "Example Button"
};
export const ExternalLink = Template.bind({});
ExternalLink.args = {
    to: "https://google.com",
    children: "Example Button"
};