import type {ReactNode} from "react";
import React from "react";
import Code from "./Code";

export default {
    title: "Base Components/Code",
    component: Code,
    argTypes: ({} as {}),
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <Code {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    children: `
        .class {
            colour: red;
        }
    `,
};
