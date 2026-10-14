import type {ReactNode} from "react";
import React from "react";
import BlockQuote from "./BlockQuote";

export default {
    title: "Base Components/BlockQuote",
    component: BlockQuote,
    argTypes: ({} as {}),
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <BlockQuote {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    children: "I say unto you: one must still have chaos in oneself to be " +
        "able to give birth to a dancing star",
};
