import React, {ReactNode} from "react";

import IssParamsOverrideControls from "@/src/components/debug/IssParamsOverrideControls.js";

export default {
    title: "Debug Components/IssParamsOverrideControls",
    component: IssParamsOverrideControls,
    argTypes: {}
};

const Template = (args): ReactNode => {
    return <IssParamsOverrideControls {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    originalIssParams: {
        "q": "house",
        "area": "Brunswick West, VIC"
    },
    issParamsOverride: {
        "q": "housing",
        "area": "Brunswick West, VIC"
    },
    setIssParamsOverride: () => undefined
};