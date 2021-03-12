/* @flow */

import React from "react";
import { action } from "@storybook/addon-actions";

import ButtonListItem from "./ButtonListItem";
import icons from "../icons"

export default {
    title: "App Components/ListItem/ButtonListItem",
    component: ButtonListItem,
    args: {
        onClick: action("clicked"),
    },
};

const Template = (args: Object) => <ButtonListItem {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary text",
    rightIcon: <icons.Chevron />,
    leftIcon: <icons.DemographicPets />,
};

export const WithChildren = Template.bind({});
WithChildren.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary text",
    rightIcon: <icons.Chevron />,
    leftIcon: <icons.DemographicPets />,
    children: <div>
      Use children instead of primaryText and secondaryText props. children can
      be JSX elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </div>,
};
