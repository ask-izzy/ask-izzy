import type {ReactNode} from "react";
import React from "react";
import IssParamsOverrideControls from "./IssParamsOverrideControls";

export default {
    title: "Debug Components/IssParamsOverrideControls",
    component: IssParamsOverrideControls,
    argTypes: ({} as {}),
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <IssParamsOverrideControls {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    originalIssParams: {
        "q": "house",
        "area": "Brunswick West, VIC",
    },
    issParamsOverride: {
        "q": "housing",
        "area": "Brunswick West, VIC",
    },
    setIssParamsOverride: () => {},
};
