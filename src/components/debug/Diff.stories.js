/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import Diff from "./Diff";
import {diffJson} from "diff";

export default {
    title: "Debug Components/Diff",
    component: Diff,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <Diff {...args} />;
};

const originalObject = {
    "q": "house",
    "area": "Brunswick West, VIC",
}

const modifiedObject = {
    "q": "house",
    "area": "Coburg, VIC",
}

const diff = diffJson(originalObject, modifiedObject)

export const Example: typeof Template = Template.bind({});
Example.args = {
    diff: diff,
};
