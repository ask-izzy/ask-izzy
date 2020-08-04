/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import FormCantFind from "./FormCantFind";

export default {
    title: "Feedback Components/FormCantFind",
    component: FormCantFind,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <FormCantFind {...args} />;
};

export const Example: typeof Template = Template.bind({});
