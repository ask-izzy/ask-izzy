/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import FormSection from "./FormSection";

export default {
    title: "App Components/FormSection",
    component: FormSection,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <FormSection {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    title: "Section title",
    children: <input />,
};
