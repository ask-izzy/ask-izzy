import React, {ReactNode} from "react";
import FormSection from "@/components/forms/FormSection.js";

export default {
    title: "App Components/FormSection",
    component: FormSection
};

const Template = (args: Record<string, any>): ReactNode => {
    return <FormSection {...args as any} />;
};

export const Example = Template.bind({});
Example.args = {
    title: "Section title",
    children: <input />
};