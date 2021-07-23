/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import Paragraph from "./Paragraph";

export default {
    title: "Base Components/Paragraph",
    component: Paragraph,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <Paragraph {...args} />;
};

export const Example: typeof Template = Template.bind({});
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
