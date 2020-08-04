/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import FormReportError from "./FormReportError";

export default {
    title: "Feedback Components/FormReportError",
    component: FormReportError,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <FormReportError {...args} />;
};

export const Example: typeof Template = Template.bind({});
