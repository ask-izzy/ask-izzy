/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import { action } from "@storybook/addon-actions";

import ListItem from "./ListItem";
import Chevron from "../icons/chevron.svg";
import DemographicPets from "../icons/demographic-pets.svg";

export default {
    title: "App Components/ListItem",
    component: ListItem,
    args: {
        onClick: (action("clicked"): any),
    },
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ListItem {...args} />;
};

export const Basic: typeof Template = Template.bind({});
Basic.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary text",
    rightIcon: <Chevron />,
    leftIcon: <DemographicPets />,
};

export const WithChildren: typeof Template = Template.bind({});
WithChildren.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary text",
    rightIcon: <Chevron />,
    leftIcon: <DemographicPets />,
    children: <div>
      Use children instead of primaryText and secondaryText props.
      Children can be JSX elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </div>,
};
