/* @flow */

import * as React from "react";
import {useState} from "react";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";

import Button from "@/src/components/base/Button"
import StandardButton from "@/components/general/StandardButton"
import Input from "@/src/components/base/Input"
import EmailIcon from "@/src/icons/Email"
import PhoneIcon from "@/src/icons/Phone"

function SendForm(): React.Node {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [sentStatus, setSentStatus] = React.useState("")
    const [messageType, setMessageType] = React.useState<"SMS" | "Email">("SMS")
    const recaptchaRef = React.useRef();


    const onSubmit = async data => {
        const captchaCode = recaptchaRef.current.getValue()
        if (!captchaCode) {
            return;
        }

        const body = JSON.stringify({
            ...data,
            captchaCode,
        })

        const res = await fetch('/api/share-services', {
            body,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        const result = await res.json();
        recaptchaRef.current.reset();
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

    return <>
        <div>
            <h2>Use Ask Izzy to send</h2>
            <p>
                Share service details in a pre-filled message via text
                or email using Ask Izzy's messaging service.
            </p>
            <nav className="messageType">
                <StandardButton
                    className={messageType === "SMS" ? "tint-2" : "tint-1"}
                    onClick={() => setMessageType("SMS")}
                >
                    <PhoneIcon
                        noSpanWrapper={true}
                        viewBox="15 15 31 31"
                    />
                    SMS
                </StandardButton>
                <StandardButton
                    className={messageType === "Email" ? "tint-2" : "tint-1"}
                    onClick={() => setMessageType("Email")}
                >
                    <EmailIcon noSpanWrapper={true} viewBox="15 22 34 24" />Email
                </StandardButton>
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
                {messageType === "SMS" && <FormTextInput
                    label="Phone number"
                    id="toPhoneNumber"
                    register={register}
                    errors={errors}
                    required={true}
                />}
                {messageType === "Email" && <FormTextInput
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
                <div className="recapture">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        size="normal"
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    />
                </div>

                <div className="formControls">
                    <StandardButton className="tint-1">
                        Cancel
                    </StandardButton>
                    <StandardButton className="tint-2">
                        <PhoneIcon
                            noSpanWrapper={true}
                            viewBox="15 15 31 31"
                        />
                        Submit
                    </StandardButton>
                </div>
            </FormSection>
        </form>
    </>

}

export default SendForm

function FormTextInput({label, id, register, description = null, required = false, errors, ...otherProps}) {

    let errorMessage

    if (errors[id]?.type === "required") {
        errorMessage = "This field is required"
    } else if (errors[id]) {
        errorMessage = [errors[id].type, errors[id]?.message]
            .filter(text => text)
            .join(": ")
    }

    const inputProps = {...register(id, { required })}
    console.log(id, inputProps)
    return <div className="FormTextInput">
        <label htmlFor={id}>
            <div className="title">
                {label}{!required && " (optional)"}
            </div>
            {errorMessage && <span className="errorMessage">{errorMessage}</span>}
            {description && <div className="description">{description}</div>}
        </label>
        <Input
            id={id}
            {...inputProps}
            {...otherProps}
        />
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
