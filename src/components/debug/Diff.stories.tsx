import type {ReactNode} from "react";
import React from "react";
import Diff from "./Diff";
import {diffJson} from "diff";

export default {
    title: "Debug Components/Diff",
    component: Diff,
    argTypes: ({} as {}),
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <Diff {...args} />;
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
