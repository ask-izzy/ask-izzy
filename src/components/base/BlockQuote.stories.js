/* @flow */
import React from "react";
import BlockQuote from "./BlockQuote";

export default {
    title: "Base Components/BlockQuote",
    component: BlockQuote,
    argTypes: {},
};

const Template = (args: Object) => <BlockQuote {...args} />;

export const Example = Template.bind({});
Example.args = {
    children: "I say unto you: one must still have chaos in oneself to be " +
        "able to give birth to a dancing star",
};
