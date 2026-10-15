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
        "search-terms": "house",
        "located-near": "brunswick west,vic",
    },
    issParamsOverride: {
        "search-terms": "housing",
        "located-near": "brunswick west,vic",
    },
    setIssParamsOverride: () => {},
};
