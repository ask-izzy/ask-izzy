import type {ReactNode} from "react";
import React from "react";

import DomesticViolenceLink from "./DomesticViolenceLink";

export default {
    title: "App Components/LogoWithTextBox/DomesticViolenceLink",
    component: DomesticViolenceLink,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <DomesticViolenceLink {...args} />;
};

export const Example: typeof Template = Template.bind({});
