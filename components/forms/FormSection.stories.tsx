import type {ReactNode} from "react";
import React from "react";

import FormSection from "./FormSection";

export default {
    title: "App Components/FormSection",
    component: FormSection,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <FormSection {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    title: "Section title",
    children: <input />,
};
