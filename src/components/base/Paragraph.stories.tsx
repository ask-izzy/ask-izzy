import React, {ReactNode} from "react";

import Paragraph from "@/src/components/base/Paragraph.js";


export default {
    title: "Base Components/Paragraph",
    component: Paragraph,
    argTypes: {}
};

const Template = (args): ReactNode => {
    return <Paragraph {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    children: [
        <p
            key="0"
        >
            Test
        </p>
    ],
    node: {
        children: [
            <p
                key="0"
            >
                Test
            </p>
        ]
    }
};