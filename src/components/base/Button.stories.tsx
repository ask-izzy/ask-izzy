import React, {ReactNode} from "react";

import Button from "@/src/components/base/Button.js";

export default {
    title: "Base Components/Button",
    component: Button,
    argTypes: ({} as Record<string, any>)
};

const Template = (args): ReactNode => {
    return <Button {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    children: `button label`
};