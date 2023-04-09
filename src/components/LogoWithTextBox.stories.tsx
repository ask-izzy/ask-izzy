import React, {ReactNode} from "react";

import LogoWithTextBox from "@/src/components/LogoWithTextBox.js";
import DemographicPets from "@/src/icons/DemographicPets.js";


export default {
    title: "App Components/LogoWithTextBox",
    component: LogoWithTextBox
};

const Template = (args): ReactNode => {
    return <LogoWithTextBox {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
    header: "Example Text",
    body: "Body text",
    icon: <DemographicPets />
};
export const RedHighlight = Template.bind({});
RedHighlight.args = {
    header: "Example Text",
    body: "Body text",
    icon: <DemographicPets />,
    highlightColor: "red"
};