/* @flow */

import * as React from "react";
import {useState} from "react";
import { useForm } from "react-hook-form";

import Dialog from "@/components/base/Dialog"
import Button from "@/src/components/base/Button"
import FlatButton from "@/src/components/FlatButton"
import Input from "@/src/components/base/Input"
import EmailIcon from "@/src/icons/Email"
import PhoneIcon from "@/src/icons/Phone"

type Props = {
    onCloseRequested: () => void
}

function ShareServices({
    onCloseRequested,
}: Props): React.Node {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [sentStatus, setSentStatus] = React.useState("")
    const [messageType, setMessageType] = React.useState("SMS")
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

    console.log("toName----", watch("toName"))

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
        <Dialog
            open={true}
            onClose={onCloseRequested}
        >
            {({close}) => (
                <div className="ShareServices">
                    <header>
                        <h1>Share My List</h1>
                        <Button
                            onClick={close}
                            className='close'
                        >
                            <span>&times;</span>
                        </Button>
                    </header>
                    <main>
                        <div>
                            <h2>Use Ask Izzy to send</h2>
                            <p>
                                Share service details in a pre-filled message via text
                                or email using Ask Izzy's messaging service.
                            </p>
                            <nav className="messageType">
                                <FlatButton
                                    className={messageType === "SMS" ? "tint-2" : "tint-1"}
                                    onClick={() => setMessageType("SMS")}
                                >
                                    <PhoneIcon
                                        noSpanWrapper={true}
                                        viewBox="15 15 31 31"
                                    />
                                    SMS
                                </FlatButton>
                                <FlatButton
                                    className={messageType === "Email" ? "tint-2" : "tint-1"}
                                    onClick={() => setMessageType("Email")}
                                >
                                    <EmailIcon noSpanWrapper={true} viewBox="15 22 34 24" />Email
                                </FlatButton>
                            </nav>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} action="/api/share-services" method="post">
                            <FormSection className="toDetails" title={`Send ${messageType} to`}>
                                <FormTextInput
                                    label="Name"
                                    id="toName"
                                    register={register}
                                    errors={errors}
                                    required={true}
                                />
                                {messageType === "SMS" || <FormTextInput
                                    label="Phone number"
                                    id="toPhoneNumber"
                                    register={register}
                                    errors={errors}
                                    required={true}
                                />}
                                {messageType === "Email" || <FormTextInput
                                    label="Email address"
                                    id="toEmail"
                                    register={register}
                                    errors={errors}
                                    required={true}
                                />}
                            </FormSection>
                            <FormSection className="fromDetails" title="From">
                                <FormTextInput
                                    label="Name"
                                    id="fromName"
                                    register={register}
                                    errors={errors}
                                    required={true}
                                />
                                <FormTextInput
                                    label="Role and organisation details"
                                    description="E.g. Case worker - Crisis Support"
                                    id="fromEmail"
                                    register={register}
                                    errors={errors}
                                />
                                <FormTextInput
                                    label="Contact details"
                                    id="fromEmail"
                                    register={register}
                                    errors={errors}
                                />
                            </FormSection>
                            <FormSection
                                className="submitDetails"
                                title="Your pre-filled message"
                            >
                                <div className="messagePreview">
                                    <div className="description">
                                        Review your pre-filled message
                                    </div>
                                    <div
                                        className="messageText"
                                    >

                                        {messageText}
                                    </div>
                                </div>
                                <div className="formControls">
                                    <FlatButton className="tint-1">
                                        Cancel
                                    </FlatButton>
                                    <FlatButton className="tint-2">
                                        <PhoneIcon
                                            noSpanWrapper={true}
                                            viewBox="15 15 31 31"
                                        />
                                        Submit
                                    </FlatButton>
                                </div>
                            </FormSection>
                        </form>
                    </main>
                </div>
            )}
        </Dialog>
    )

}

export default ShareServices

function FormTextInput({label, id, register, description = null, required = false, errors, ...otherProps}) {


    const inputProps = {...register(id, { required })}
    console.log(id, inputProps)
    return <div className="FormTextInput">
        <label htmlFor={id}>
            <div className="title">
                {label}{!required && " (optional)"}
            </div>
            <div className="description">
                {description}
            </div>
        </label>

        <Input
            id={id}
            {...inputProps}
            {...otherProps}
        />
        {errors[id]?.type === "required" && <span>This field is required</span>}
    </div>
}

function FormSection({title, className, children}) {
    return (
        <fieldset className={"FormSection " + className}>
            <legend>{title}</legend>
            {children}
        </fieldset>
    )
}
