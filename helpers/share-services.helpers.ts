import * as yup from "yup";
import {htmlEscape} from "escape-goat"

import Service from "@/src/iss/Service.js"
import {lookbehindIsSupported} from "@/helpers/regex.helpers.js"


export type MessageType = "SMS" | "Email"

type GetMessageProps = {
    services: Array<Service>,
    baseUrl: string,
    toName: string | null,
    fromName: string | null,
    fromRole: string | null,
    fromContactDetails: string | null,
    messageType: MessageType,
};

// eslint-disable-next-line complexity
export function getShareMessage(args: GetMessageProps): { subject: string, body: string } {
    const {services, baseUrl, messageType} = args
    const toName = escapeText(args.toName)
    const fromName = escapeText(args.fromName)
    const fromRole = escapeText(args.fromRole)
    const fromContactDetails = escapeText(args.fromContactDetails, {multiline: true})
    const abuseReportEmail = process.env.NEXT_PUBLIC_SITE_EMAIL;

    const isPlural = services.length > 1;

    let messageText = `You've received a message from someone using the Ask Izzy website:\n\n` +
        `Hi ${toName || "[name of recipient]"}, ` +
        `${isPlural ?
            "here are some links to support services"
            : "here's a link to a support service"
        },`
    for (const service of services) {
        const serviceURL = `${baseUrl}/service/${service.slug}`
        const serviceAddress = service.location?.singleLineStreetAddress()
        if (messageType === "Email") {
            messageText += `\n\n${service.name}` +
                (serviceAddress ? `\n${serviceAddress}` : "") +
                `\n<a href="${serviceURL}">View this service in Ask Izzy</a>`
        } else {
            messageText += `\n\n${service.name}` +
                    (serviceAddress ? `\n${serviceAddress}` : "") +
                    `\n${serviceURL}`;
        }
    }

    messageText += `\n\nFrom,\n${fromName || "[name of sender]"}`;
    if (fromRole) {
        messageText += `\n${fromRole}`;
    }
    if (fromContactDetails) {
        messageText += `\nContact details:${messageType === "Email" ? " " : "\n"}` +
        `${
            fromContactDetails.indexOf("@") > -1 ?
                messageType === "Email" ?
                    `<a href="mailto: ${fromContactDetails}">${fromContactDetails}</a>`
                    : fromContactDetails
                : fromContactDetails
        }`
    }
    if (messageType === "Email") {
        messageText += `\n\nReport this email:\nIf this message is unwanted ` +
        `or offensive please forward this email to ${abuseReportEmail} ` +
        `and make sure the contents of this message is included as we ` +
        `don't store a copy for privacy reasons.` +
        `\n\nThis message has been sent to you via <a href="https://www.askizzy.org.au">askizzy.org.au</a>`
    } else if (messageType === "SMS") {
        messageText += `\n\nReport this message:\nIf this message is unwanted ` +
        `or offensive please email ${abuseReportEmail} and include the text in ` +
        `this message as we don't store a copy for privacy reasons.` +
        `\n\nThis message has been sent to you via askizzy.org.au`
    } else {
        throw Error(`Unknown message type: ${messageType}`)
    }

    if (messageType === "Email") {
        messageText = messageText.replaceAll("\n", "<br />")
    }

    const subject = isPlural ?
        `${fromName || "[name of recipient]"} has shared services from Ask Izzy  with you`
        : `${fromName || "[name of recipient]"} has shared a service from Ask Izzy with you`

    return {
        subject,
        body: messageText,
    };
}

const maxErrorMessage = "Maximum of ${max} characters"

const sharedSchema = yup.object({
    toName: yup.string().required().max(30, maxErrorMessage).trim(),
    fromName: yup.string().required().max(30, maxErrorMessage).trim(),
    fromRole: yup.string().max(60, maxErrorMessage).trim(),
    fromContactDetails: yup.string().trim(),
    captchaCode: yup.string().required(),
});

export const smsSchema = (sharedSchema.shape({
    toPhoneNumber: yup
        .string()
        .required()
        .transform(normalisePhoneNumber)
        .test(
            "valid-aus-phone-number",
            "Must be a valid Australian phone number",
            verifyPhoneNumber,
        ),
}));

export const emailSchema = (sharedSchema.shape({
    toEmail: yup.string().required().email("Invalid email address"),
}));

export type MessageRequestSchema = typeof smsSchema | typeof emailSchema

export function getShareReqSchema(messageType: MessageType): MessageRequestSchema {
    if (messageType === "SMS") {
        return smsSchema
    } else {
        return emailSchema
    }
}

export async function getRequestType(request): Promise<MessageType | null> {
    if (await smsSchema.isValid(request)) {
        return "SMS";
    } else if (await emailSchema.isValid(request)) {
        return "Email";
    } else {
        return null;
    }
}

export function normalisePhoneNumber(phoneNumber: string): string {
    // Remove this when regex lookbehinds are supported in all browsers we
    // support.
    if (!lookbehindIsSupported()) {
        return phoneNumber
            .replaceAll(/[ ()-]/g, "")
            .replaceAll(
                /[ ()-+]/g,
                // If we match with a leading + then add that + back
                (match, offset) => (
                    match === "+" && offset === 0 ? match : ""
                ),
            )
            .replace(/^0/, "+61");
    }

    return phoneNumber
        // RegEx must be created via a string rather than a literal otherwise
        // it will bork browsers that don't support lookbehinds even if those
        // browsers never execute this line.
        .replaceAll(new RegExp("(?:[ ()-]|(?<!^)\\+)", "g"), "")
        .replace(/^0/, "+61");
}

export function verifyPhoneNumber(phoneNumber: string): boolean {
    let hasNonLeadingPlus: any = false

    if (lookbehindIsSupported()) {
        // RegEx must be created via a string rather than a literal otherwise
        // it will bork browsers that don't support lookbehinds even if those
        // browsers never execute this line.
        hasNonLeadingPlus = phoneNumber.match(new RegExp("(?<!^\\s*)\\+", "g"))
    } else {
        // Remove this when regex lookbehinds are supported in all browsers we
        // support.
        hasNonLeadingPlus = phoneNumber.match(/^\s*\+/g)?.length !== phoneNumber.match(/\s*\+/g)?.length
    }

    // Phone number should only have numbers, separating chars, or and leading +
    if (
        phoneNumber.match(/[^0-9+ ()-]/g) ||
        hasNonLeadingPlus
    ) {
        return false;
    }

    // Should either start with either no international country code or the Australian one
    if (!phoneNumber.match(/^(?:\d|\+61)/)) {
        return false;
    }
    return true;
}

type EscapeTextOptions = {
    multiline: boolean
}

function escapeText(
    text: string | null,
    options: EscapeTextOptions = {multiline: false},
): string | null {
    if (typeof text !== "string") {
        return null
    }
    let escapedText = htmlEscape(text)
    if (!options.multiline) {
        escapedText = escapedText
            .replaceAll("\n", " ")
            .trim()
    } else {
        // Only allow one newline char at a time
        escapedText = escapedText
            .replaceAll(/\n+/g, "\n")
            .split("\n")
            .map(line => line.trim())
            .join("\n")
    }
    return escapedText
}
