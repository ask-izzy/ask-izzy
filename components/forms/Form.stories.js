/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import { action } from "@storybook/addon-actions";

import Form from "./Form";

export default {
    title: "App Components/Form",
    component: Form,
};

const ShowFormContextInfo = (): ReactNode => {
    const {getValues} = useFormContext();
    return <div>
        <h1>Form data</h1>
        <pre>{JSON.stringify(getValues(), null, 2)}</pre>
    </div>
}

const Template = (args: Object): ReactNode => {
    const formProps = useForm({
        mode: "onTouched",
    });
    formProps.register("full-name")
    formProps.setValue("full-name", "Alex Woo");
    (Template.args: any); return (
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
    );
};

export const Example: typeof Template = Template.bind({});
