import React, {ReactNode} from "react";

import Code from "@/src/components/base/Code";

export default {
    title: "Base Components/Code",
    component: Code,
    argTypes: {}
};

const Template = (args): ReactNode => {
    return <Code {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    children: `
        .class {
            colour: red;
        }
    `
};