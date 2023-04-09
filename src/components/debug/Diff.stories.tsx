import React, {ReactNode} from "react";
import {diffJson} from "diff";

import Diff from "@/src/components/debug/Diff.js";



export default {
    title: "Debug Components/Diff",
    component: Diff,
    argTypes: {}
};

const Template = (args): ReactNode => {
    return <Diff {...args} />;
};

const originalObject = {
    "q": "house",
    "area": "Brunswick West, VIC"
};
const modifiedObject = {
    "q": "house",
    "area": "Coburg, VIC"
};
const diff = diffJson(originalObject, modifiedObject);
export const Example = Template.bind({});
Example.args = {
    diff: diff
};