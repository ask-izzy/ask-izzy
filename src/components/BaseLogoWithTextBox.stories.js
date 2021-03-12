/* @flow */

import React from "react";

import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import icons from "../icons"

export default {
    title: "App Components/BaseLogoWithTextBox",
    component: BaseLogoWithTextBox,
};

const Template = (args: Object) => <BaseLogoWithTextBox {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    header: "Example Text",
    body: "Body text",
    icon: <icons.DemographicPets />,
};

export const RedHighlight = Template.bind({});
RedHighlight.args = {
    header: "Example Text",
    body: "Body text",
    icon: <icons.DemographicPets />,
    highlightColor: "red",
};
