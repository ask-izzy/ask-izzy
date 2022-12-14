import React, {ReactNode} from "react";

import BlockQuote from "@/src/components/base/BlockQuote";

export default {
    title: "Base Components/BlockQuote",
    component: BlockQuote,
    argTypes: ({} as Record<string, never>)
};

const Template = (args): ReactNode => {
    return <BlockQuote {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    children: "I say unto you: one must still have chaos in oneself to be " +
        "able to give birth to a dancing star"
};