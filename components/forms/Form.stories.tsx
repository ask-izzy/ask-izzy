import React, {ReactNode} from "react";
import { useForm, useFormContext } from "react-hook-form";
import { action } from "@storybook/addon-actions";

import Form from "@/components/forms/Form.js";


export default {
    title: "App Components/Form",
    component: Form
};

const ShowFormContextInfo = () => {
    const {
        getValues
    } = useFormContext();
    return <div>
        <h1>Form data</h1>
        <pre>{JSON.stringify(getValues(), null, 2)}</pre>
    </div>;
};

const Template = (args: Record<string, any>): ReactNode => {
    const formProps = useForm({
        mode: "onTouched"
    });
    formProps.register("full-name");
    formProps.setValue("full-name", "Alex Woo");
    return (
        <Form
            onSubmit={formProps.handleSubmit(action("submitted"))}
            action="/api/share-services"
            method="post"
            {...formProps}
            {...args}
        >
            <ShowFormContextInfo />
            <button type="submit">Submit</button>
        </Form>
    )
};

export const Example: typeof Template = Template.bind({});