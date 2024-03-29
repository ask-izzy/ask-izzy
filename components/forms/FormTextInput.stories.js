/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import { useForm } from "react-hook-form";
import { action } from "@storybook/addon-actions";

import FormTextInput from "./FormTextInput";
import Form from "@/components/forms/Form";

export default {
    title: "App Components/FormTextInput",
    component: FormTextInput,
    parameters: {
        // Needed as a work around for this issue:
        // https://github.com/react-hook-form/react-hook-form/issues/4449
        // https://github.com/storybookjs/storybook/issues/12747#issuecomment-707265001
        docs: { source: { type: "code" } },
    },
};

const Template = (args: Object): ReactNode => {
    const formProps = useForm({
        mode: "onTouched",
    });
    (Template.args: any); return (
        <Form
            onSubmit={formProps.handleSubmit(action("submitted"))}
            {...formProps}
        >
            <FormTextInput {...args} />
        </Form>
    );
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    label: "Full Name",
    id: "full-name",
};


export const ExampleWithDescription: typeof Template = Template.bind({});
ExampleWithDescription.args = {
    label: "Full Name",
    id: "full-name",
    description: "The full name of the user",
};
