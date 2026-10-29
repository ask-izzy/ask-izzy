import type {ReactNode} from "react";
import React from "react";
import { action } from "@storybook/addon-actions";

import ListItem from "./ListItem";
import icons from "../icons"

export default {
    title: "App Components/ListItem",
    component: ListItem,
    args: {
        onClick: (action("clicked") as any),
    },
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <ListItem {...args} />;
};

export const Basic: typeof Template = Template.bind({});
Basic.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary text",
    rightIcon: <icons.Chevron />,
    leftIcon: <icons.DemographicPets />,
};

export const WithChildren: typeof Template = Template.bind({});
WithChildren.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary text",
    rightIcon: <icons.Chevron />,
    leftIcon: <icons.DemographicPets />,
    children: <div>
      Use children instead of primaryText and secondaryText props.
      Children can be JSX elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </div>,
};
