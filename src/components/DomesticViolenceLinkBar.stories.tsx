import React, {ReactNode} from "react";

import DomesticViolenceLinkBar from "@/src/components/DomesticViolenceLinkBar";

export default {
    title: "App Components/DomesticViolenceLinkBar",
    component: DomesticViolenceLinkBar
};

const Template = (args): ReactNode => {
    return <DomesticViolenceLinkBar {...args} />;
};

export const Example = Template.bind({});