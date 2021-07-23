/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import Code from "./Code";

export default {
    title: "Base Components/Code",
    component: Code,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <Code {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    children: `
        .class {
            colour: red;
        }
    `,
};
