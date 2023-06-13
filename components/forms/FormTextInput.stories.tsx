import React, {ReactNode} from "react";
import { useForm } from "react-hook-form";
import { action } from "@storybook/addon-actions";
import FormTextInput from "@/components/forms/FormTextInput.js";
import Form from "@/components/forms/Form.js";

export default {
    title: "App Components/FormTextInput",
    component: FormTextInput,
    parameters: {
    // Needed as a work around for this issue:
    // https://github.com/react-hook-form/react-hook-form/issues/4449
    // https://github.com/storybookjs/storybook/issues/12747#issuecomment-707265001
        docs: {
            source: {
                type: "code"
            }
        }
    }
};

const Template = (args: Record<string, any>): ReactNode => {
    const formProps = useForm({
        mode: "onTouched"
    });
    return (
        <Form
            onSubmit={formProps.handleSubmit(action("submitted"))}
            {...formProps}
        >
            <FormTextInput {...args as any} />
        </Form>
    )
};

export const Example = Template.bind({});
Example.args = {
    label: "Full Name",
    id: "full-name"
}

export const ExampleWithDescription = Template.bind({});
ExampleWithDescription.args = {
    label: "Full Name",
    id: "full-name",
    description: "The full name of the user"
};