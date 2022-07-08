/* @flow */

import * as React from "react";
import {useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";

import isMounted from "@/hooks/useIsMounted"
import Button from "@/src/components/base/Button"
import StandardButton from "@/components/general/StandardButton"
import Input from "@/src/components/base/Input"
import EmailIcon from "@/src/icons/Email"
import PhoneIcon from "@/src/icons/Phone"
import Service from "@/src/iss/Service"
import storage from "@/src/storage";
import LoadingIcon from "@/src/icons/Loading";

type Props = {
    services: Array<Service>
}

function SendForm({
    services,
}: Props): React.Node {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        mode: "onTouched",
        // reValidateMode: "onChange",
    });
    const [sentStatus, setSentStatus] = React.useState("")
    const [currentlySubmitting, setCurrentlySubmitting] = React.useState(false)
    const [messageType, setMessageType] = React.useState<"SMS" | "Email">("SMS")
    const recaptchaRef = React.useRef();


    const onSubmit = async data => {
        setCurrentlySubmitting(true)

        try {
            const body = JSON.stringify({
                ...data,
                services: services.map(service => service.id),
            })

            const res = await fetch('/api/share-services', {
                body,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });

            if (res.status < 200 || res.status >= 300) {
                throw Error()
            }
            recaptchaRef.current.reset();
            setSentStatus("Message is sent")

        } catch (error) {
            setSentStatus("Message failed")
            setCurrentlySubmitting(false)
        }
    }

    if (typeof window !== "undefined" && !window.recaptchaOptions) {
        window.recaptchaOptions = {
            useRecaptchaNet: true,
        };
    }

    console.log("toName----", watch("toName"))

    const messageText = getMessageText({
        services,
        toName: watch("toName"),
        fromName: watch("fromName"),
        fromRole: watch("fromRole"),
        fromContactDetails: watch("fromContactDetails"),
    })



    const onVerifyCaptcha = (token) => {
        setValue('captchaCode', token);
    };

    useEffect(() => {
        register('captchaCode', { required: true });
    }, []);


    if (sentStatus) {
        return <div className="SendForm status">
            <h2>{sentStatus}</h2>
        </div>
    }

    return <div className="SendForm">
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
                    validate={verifyPhoneNumber}
                    customErrorText={{
                        validate: "Please enter a valid Australian phone number",
                    }}
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
                {(storage.getItem("who-is-looking-for-help") === "User Worker") && (
                    <FormTextInput
                        label="Role and organisation details"
                        description="E.g. Case worker - Crisis Support"
                        id="fromRole"
                        register={register}
                        errors={errors}
                    />
                )}
                <FormTextInput
                    label="Contact details"
                    id="fromContactDetails"
                    register={register}
                    errors={errors}
                />
            </FormSection>
            {renderSubmitDetailsSection(errors, recaptchaRef, onVerifyCaptcha, currentlySubmitting, messageText)}
        </form>
    </div>
}

export default SendForm

function FormTextInput({
    label,
    id,
    register,
    description = null,
    required = false,
    errors,
    validate = null,
    customErrorText = {},
    ...otherProps
}) {
    let errorMessage

    if (errors[id]?.type === "required") {
        errorMessage = "This field is required"
    } else if (errors[id]) {
        if (customErrorText[errors[id].type]) {
            errorMessage = customErrorText[errors[id].type]
        } else {
            errorMessage = [errors[id].type, errors[id]?.message]
                .filter(text => text)
                .join(": ")
        }
    }

    const inputProps = {...register(id, { required, validate })}

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

type GetMessageProps = {
    services: Array<Service>,
    toName: ?string,
    fromName: ?string,
    fromRole: ?string,
    fromContactDetails: ?string,
}

function renderSubmitDetailsSection(errors, recaptchaRef, onVerifyCaptcha, currentlySubmitting, messageText) {
    return (
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
                    onChange={onVerifyCaptcha}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                />
                {errors.captchaCode && <span className="errorMessage">Please verify the CAPTCHA</span>}
                {console.log("errors", errors)}
            </div>

            <div className="formControls">
                <StandardButton className="tint-1">
                    Cancel
                </StandardButton>
                <StandardButton
                    className="submitButton tint-2"
                    disabled={currentlySubmitting}
                >
                    {currentlySubmitting ?
                        <LoadingIcon className="inline-icon" />
                        : <>
                            <PhoneIcon
                                noSpanWrapper={true}
                                viewBox="15 15 31 31"
                            />
                            Submit
                        </>
                    }
                </StandardButton>
            </div>
        </FormSection>
    )
}

export function getMessageText({
    services,
    toName,
    fromName,
    fromRole,
    fromContactDetails,
}: GetMessageProps): string {
    const isPlural = services.length > 1

    const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL

    let messageText = `Hi ${toName || "[name of recipient]"}, `
    if (isPlural) {
        messageText += `here are some links to services`
        for (const service of services) {
            messageText += `\n\n${service.name}\n` +
                "Address: " + (service.location?.singleLineStreetAddress() ?? "") +
                `\nMore info: ${baseUrl}/service/${service.slug}`
        }
    } else {
        const service = services[0]
        messageText += `here's a link to ${service.name}\n\n` +
            (service.location?.singleLineStreetAddress() ?? "") +
            `\n\n${baseUrl}/service/${service.slug}`
    }
    messageText += `\n\nFrom, ${fromName || "[name of sender]"}`
    if (fromRole) {
        messageText += `\n${fromRole}`
    }
    if (fromContactDetails) {
        messageText += `\nContact details: ${fromContactDetails}`
    }
    messageText += `\n\nThis message was sent by a user of askizzy.org.au. Report this message`
    return messageText
}

export function normalisePhoneNumber(phoneNumber: string): string {
    return phoneNumber
        .replaceAll(/(?:[ ()-]|(?<!^)\+)/g, "")
        .replace(/^0/, "+61")
}

export function verifyPhoneNumber(phoneNumber: string): boolean {
    // Phone number should only have numbers, separating chars, or and leading +
    if (phoneNumber.match(/[^0-9+ ()-]/g) || phoneNumber.match(/(?<!^\s*)\+/g)) {
        return false
    }

    // Should either start with no international country code or it starts with the Australian one
    if (!phoneNumber.match(/^(?:\d|\+61)/)) {
        return false
    }
    return true
}
