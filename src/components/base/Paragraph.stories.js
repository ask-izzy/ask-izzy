/* @flow */
import React from "react";
import Paragraph from "./Paragraph";

export default {
    title: "Base Components/Paragraph",
    component: Paragraph,
    argTypes: {},
};

const Template = (args: Object) => <Paragraph {...args} />;

export const Example = Template.bind({});
Example.args = {
    children: [
        <p>Test</p>,
    ],
    node: {
        children: [
            <p>Test</p>,
        ],
    },
};
