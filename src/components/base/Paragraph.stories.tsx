import type {ReactNode} from "react";
import React from "react";
import Paragraph from "./Paragraph";

export default {
    title: "Base Components/Paragraph",
    component: Paragraph,
    argTypes: ({} as {}),
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <Paragraph {...args} />;
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
