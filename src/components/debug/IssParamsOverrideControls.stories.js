/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import IssParamsOverrideControls from "./IssParamsOverrideControls";

export default {
    title: "Debug Components/IssParamsOverrideControls",
    component: IssParamsOverrideControls,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <IssParamsOverrideControls {...args} />;
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
