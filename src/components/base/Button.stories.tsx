import type {ReactNode} from "react";
import React from "react";
import Button from "./Button";

export default {
    title: "Base Components/Button",
    component: Button,
    argTypes: ({} as {}),
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <Button {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    children: `button label`,
};
