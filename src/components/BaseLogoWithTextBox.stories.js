/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import icons from "../icons"

export default {
    title: "App Components/BaseLogoWithTextBox",
    component: BaseLogoWithTextBox,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <BaseLogoWithTextBox {...args} />;
};

export const Basic: typeof Template = Template.bind({});
Basic.args = {
    header: "Example Text",
    body: "Body text",
    icon: <icons.DemographicPets />,
};

export const RedHighlight: typeof Template = Template.bind({});
RedHighlight.args = {
    header: "Example Text",
    body: "Body text",
    icon: <icons.DemographicPets />,
    highlightColor: "red",
};
