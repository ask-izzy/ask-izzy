/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import Button from "./Button";

export default {
    title: "Base Components/Button",
    component: Button,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <Button {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    children: `button label`,
};
