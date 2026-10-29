import type {ReactNode} from "react";
import React from "react";

import LogoWithTextBox from "./LogoWithTextBox";
import icons from "../icons"

export default {
    title: "App Components/LogoWithTextBox",
    component: LogoWithTextBox,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <LogoWithTextBox {...args} />;
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
