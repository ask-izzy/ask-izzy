/* @flow */
import React from "react";
import Code from "./Code";

export default {
    title: "Base Components/Code",
    component: Code,
    argTypes: {},
};

const Template = (args: Object) => <Code {...args} />;

export const Example = Template.bind({});
Example.args = {
    children: `
        .class {
            colour: red;
        }
    `,
};
