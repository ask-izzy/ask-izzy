import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import {yupResolver} from "@hookform/resolvers/yup";

import Form from "@/components/forms/Form.js"
import StandardButton from "@/components/general/StandardButton.js"
import EmailIcon from "@/src/icons/Email.js"
import SendIcon from "@/src/icons/Send.js"
import PhoneIcon from "@/src/icons/Phone.js"
import LoadingIcon from "@/src/icons/Loading.js";
import Service from "@/src/iss/Service.js"
import storage from "@/src/storage.js";
import FormTextInput from "@/components/forms/FormTextInput.js"
import FormSection from "@/components/forms/FormSection.js"
import {getShareMessage, getShareReqSchema} from "@/helpers/share-services.helpers.js"
import type { MessageType } from "@/helpers/share-services.helpers.js"
import useSubmitForm from "@/components/ShareServicesDialog/use-submit-form.hook.js"
import useIsMounted from "@/hooks/useIsMounted.js"
import { usersnapFireEvent } from "@/helpers/usersnap.helpers.js"
import useToastMessage from "@/hooks/useToastMessage.js"
import * as gtm from "@/src/google-tag-manager.js";


type Props = {
    services: Array<Service>,
    onCloseRequest: () => void,
}

function SendForm({
    services,
    onCloseRequest,
}: Props) {
    const [messageType, setMessageType] = React.useState<MessageType>("SMS")
    const schema = getShareReqSchema(messageType)
    const formProps = useForm({
        mode: "onTouched",
        resolver: yupResolver(schema),
    });
    const {watch, formState, register, setValue} = formProps
    const [sentStatus, setSentStatus] = React.useState("")
    const recaptchaRef = React.useRef<ReCAPTCHA>(null);
    const {openToastMessage} = useToastMessage()

    const { submitForm, currentlySubmitting } = useSubmitForm(services)

    const isMounted = useIsMounted()

    async function onSubmit(data) {
        const status = await submitForm(data)
        recaptchaRef.current?.reset();
        let displayToastMessage: () => void = () => undefined
        if (status === "Message is sent") {
            displayToastMessage = () => {
                openToastMessage(`${messageType} sent via Ask Izzy`)
            }
            usersnapFireEvent("services-shared")
            gtm.emit({
                event: "Action Triggered - Services Shared Via Ask Izzy",
                eventCat: "Action triggered",
                eventAction: "Services shared",
                eventLabel: `${messageType} via Ask Izzy`,
                eventValue: services.length,
                sendDirectlyToGA: true,
            });
            for (const service of services) {
                gtm.emit({
                    event: "Action Triggered - Services Shared Via Ask Izzy (individual)",
                    eventCat: "Action triggered",
                    eventAction: "Services shared (individual)",
                    eventLabel: `${messageType} via Ask Izzy`,
                    eventValue: service.id,
                    sendDirectlyToGA: true,
                });
            }
        } else {
            displayToastMessage = () => {
                openToastMessage("Error sharing services, please try again")
            }
            gtm.emit({
                event: "Action Triggered - Failed To Share Services",
                eventCat: "Action triggered",
                eventAction: "Failed to share services",
                eventLabel: `${messageType} via Ask Izzy - ${status}`,
                eventValue: services.length,
                sendDirectlyToGA: true,
            });
        }
        setSentStatus(status)
        onCloseRequest()
        setTimeout(displayToastMessage, 0)

    }

    if (typeof window !== "undefined" && !(window as any).recaptchaOptions) {
        (window as any).recaptchaOptions = {
            useRecaptchaNet: true,
        };
    }

    const messageText = getShareMessage({
        services,
        baseUrl: isMounted ? location.origin : "",
        toName: watch("toName"),
        fromName: watch("fromName"),
        fromRole: watch("fromRole"),
        fromContactDetails: watch("fromContactDetails"),
        messageType,
    })

    const onVerifyCaptcha = (token) => setValue("captchaCode", token);
    useEffect(
        () => {
            register("captchaCode")
        },
        [],
    );

    if (sentStatus) {
        return (
            <div className="SendForm status">
                <h2>{sentStatus}</h2>
            </div>
        )
    }

    return <div className="SendForm">
        <div>
            <h2>Use Ask Izzy to send</h2>
            <p>
                Share service details in a pre-filled message via text
                or email using Ask Izzy&apos;s messaging service.
            </p>
            <nav className="messageType">
                <StandardButton
                    className={"invert-colour-contrast"}
                    type={messageType === "SMS" ? "primary" : "secondary"}
                    onClick={() => setMessageType("SMS")}
                >
                    <PhoneIcon
                        noSpanWrapper={true}
                        viewBox="15 15 31 31"
                    />
                    SMS
                </StandardButton>
                <StandardButton
                    className={"invert-colour-contrast"}
                    type={messageType === "Email" ? "primary" : "secondary"}
                    onClick={() => setMessageType("Email")}
                >
                    <EmailIcon noSpanWrapper={true}
                        viewBox="15 22 34 24"
                    />Email
                </StandardButton>
            </nav>
        </div>
        <Form
            onSubmit={formProps.handleSubmit(onSubmit)}
            action="/api/share-services"
            method="post"
            {...formProps}
            schema={schema}
        >
            <FormSection
                className="toDetails"
                title={`Send ${messageType} to`}
                aria-label={`Send ${messageType} to`}
            >
                <FormTextInput
                    label="Name"
                    id="toName"
                />
                {messageType === "SMS" && (
                    <FormTextInput
                        label="Phone number"
                        id="toPhoneNumber"
                    />
                )}
                {messageType === "Email" && (
                    <FormTextInput
                        label="Email address"
                        id="toEmail"
                    />
                )}
            </FormSection>
            <FormSection
                className="fromDetails"
                title="From"
            >
                <FormTextInput
                    label="Name"
                    id="fromName"
                />
                {(storage.getItem("who-is-looking-for-help") === "User Worker") && (
                    <FormTextInput
                        label="Role and organisation details"
                        description="E.g. Case worker - Crisis Support"
                        id="fromRole"
                    />
                )}
                <FormTextInput
                    label="Contact details"
                    id="fromContactDetails"
                />
            </FormSection>
            {renderSubmitDetailsSection(
                recaptchaRef,
                onVerifyCaptcha,
                currentlySubmitting,
                messageText,
                onCloseRequest,
                formState,
                messageType,
            )}
        </Form>
    </div>
}

export default SendForm

function renderSubmitDetailsSection(
    recaptchaRef,
    onVerifyCaptcha,
    currentlySubmitting,
    messageText,
    onCloseRequest,
    formState,
    messageType,
) {
    const messagePreviewContentsProp = messageType === "Email" ?
        {dangerouslySetInnerHTML: {__html: messageText.body}}
        : {children: messageText.body}
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
                    {...messagePreviewContentsProp}
                />
            </div>
            <div className="recapture">
                <ReCAPTCHA
                    ref={recaptchaRef}
                    size="normal"
                    onChange={onVerifyCaptcha}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                />
                {formState.errors.captchaCode &&
                    <span className="errorMessage">Please verify the CAPTCHA</span>
                }
            </div>

            <div className="formControls">
                <StandardButton
                    className="tint-1"
                    onClick={onCloseRequest}
                >
                    Cancel
                </StandardButton>
                <StandardButton
                    className="submitButton tint-2"
                    disabled={currentlySubmitting}
                    onClick={() => undefined}
                >
                    {currentlySubmitting ?
                        <LoadingIcon className="inline-icon" />
                        : <>
                            Send
                            <SendIcon/>
                        </>
                    }
                </StandardButton>
            </div>
        </FormSection>
    )
}
