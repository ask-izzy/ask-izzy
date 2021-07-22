/* @flow */

import type {Node} from "React";
import React from "react";

import DomesticViolenceLink from "./DomesticViolenceLink";

export default {
    title: "App Components/BaseLogoWithTextBox/DomesticViolenceLink",
    component: DomesticViolenceLink,
};

const Template = (args: Object): Node => {
    (Template.args: any); return <DomesticViolenceLink {...args} />;
};

export const Example: typeof Template = Template.bind({});
