import React, {ReactNode} from "react";

import DomesticViolenceLink from "@/src/components/DomesticViolenceLink.js";


export default {
    title: "App Components/LogoWithTextBox/DomesticViolenceLink",
    component: DomesticViolenceLink
};

const Template = (args): ReactNode => {
    return <DomesticViolenceLink {...args} />;
};

export const Example = Template.bind({});