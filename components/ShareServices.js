/* @flow */

import * as React from "react";
import { useForm } from "react-hook-form";

type Props = {
}

function ShareServices(
    {
    }: Props): React.Node {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [sentStatus, setSentStatus] = React.useState("")
    const onSubmit = async data => {
        console.log(data);

        const res = await fetch('/api/share-services', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        const result = await res.json();
        setSentStatus("Message is sent")
    }

    console.log(watch("toName"))

    const messageText = `
        Hi ${watch("toName") || "[name of recipient]"}, here's a link to West Kitchen Project

        Soup kitchen on Fridays

        90 Mitchell Street, Maidstone, VIC 3012

        https://askizzy.org.au/service/4566605

        From, ${watch("fromName") || "[name of sender]"}

        This message was sent by a user of askizzy.org.au. Report this message
    `.replaceAll(/\n {8}/g, "\n").trim()

    if (sentStatus) {
        return <h2>{sentStatus}</h2>
    }

    return (
        <div className="ShareServices">
            {/* <form action="/send-data-here" method="post">
                <label htmlFor="first">First name:</label>
                <input type="text" id="first" name="first" />
                <label htmlFor="last">Last name:</label>
                <input type="text" id="last" name="last" />
                <button type="submit">Submit</button>
            </form> */}
            <form onSubmit={handleSubmit(onSubmit)} action="/api/share-services" method="post">
                <FormSection title="Send Email to">
                    <Input
                        label="Name"
                        id="toName"
                        register={register}
                        errors={errors}
                        required={true}
                    />
                    <Input
                        label="Email address"
                        id="toEmail"
                        register={register}
                        errors={errors}
                        required={true}
                    />
                </FormSection>
                <FormSection title="From">
                    <Input
                        label="Name"
                        id="fromName"
                        register={register}
                        errors={errors}
                        required={true}
                    />
                    <Input
                        label="Role and organisation details"
                        description="E.g. Case worker - Crisis Support"
                        id="fromEmail"
                        register={register}
                        errors={errors}
                    />
                    <Input
                        label="Contact details"
                        id="fromEmail"
                        register={register}
                        errors={errors}
                    />
                </FormSection>
                <FormSection title="Your pre-filled message">
                    <Input
                        label="Add custom service description"
                        description="Up to 50 characters"
                        id="fromEmail"
                        register={register}
                        errors={errors}
                    />

                    Review your pre-filled message
                    <br />
                    <textarea name="messageText" value={messageText} rows="15" cols="50" />
                </FormSection>
                <br />

                <input type="submit" />
            </form>
        </div>
    )

}

export default ShareServices

function Input({label, id, register, description = null, required = false, errors, ...otherProps}) {
    return <>
        <label htmlFor={id}>
            {label}{!required && " (optional)"}
            {description && <><br />{description}</>}
        </label>
        <br />

        <input
            id={id}
            {...register(id, { required })}
            {...otherProps}
        />
        {errors[id]?.type === "required" && <span>This field is required</span>}
        <br />
    </>
}

function FormSection({title, children}) {
    return (
        <fieldset>
            <br />
            <strong><legend>{title}</legend></strong>
            {children}
        </fieldset>
    )
}
