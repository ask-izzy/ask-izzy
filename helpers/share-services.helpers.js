/* @flow */
import * as yup from "yup";
import {htmlEscape} from "escape-goat"

import Service from "@/src/iss/Service"
import {lookbehindIsSupported} from "@/helpers/regex.helpers.js"

export type MessageType = "SMS" | "Email"

type GetMessageProps = {
    services: Array<Service>,
    baseUrl: string,
    toName: ?string,
    fromName: ?string,
    fromRole: ?string,
    fromContactDetails: ?string,
};

// eslint-disable-next-line complexity
export function getShareMessage(args: GetMessageProps): { subject: string, body: string } {
    const {services, baseUrl} = args
    const toName = args.toName && htmlEscape(args.toName)
    const fromName = args.fromName && htmlEscape(args.fromName)
    const fromRole = args.fromRole && htmlEscape(args.fromRole)
    const fromContactDetails = args.fromContactDetails && htmlEscape(args.fromContactDetails)

    const isPlural = services.length > 1;

    let messageText = `Hi ${toName || "[name of recipient]"}, `;
    if (isPlural) {
        messageText += `here are some links to services`;
        for (const service of services) {
            messageText +=
                `\n\n${service.name}\n` +
                "Address: " +
                (service.location?.singleLineStreetAddress() ?? "") +
                `\nMore info: ${baseUrl}/service/${service.slug}`;
        }
    } else {
        const service = services[0];
        messageText +=
            `here's a link to ${service.name}\n\n` +
            (service.location?.singleLineStreetAddress() ?? "") +
            `\n\n${baseUrl}/service/${service.slug}`;
    }
    messageText += `\n\nFrom, ${fromName || "[name of sender]"}`;
    if (fromRole) {
        messageText += `\n${fromRole}`;
    }
    if (fromContactDetails) {
        messageText += `\nContact details: ${fromContactDetails}`;
    }
    messageText +=
        `\n\nThis message was sent by a user of askizzy.org.au. If this message is offensive ` +
        `please report it to ${process.env.NEXT_PUBLIC_SITE_EMAIL} and include the entire text of this ` +
        `message since we don't store a copy for privacy reasons.`;

    const subject = isPlural ?
        `${fromName || "[name of recipient]"} has shared some Ask Izzy services with you`
        : `${fromName || "[name of recipient]"} has shared an Ask Izzy service with you`;

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
            verifyPhoneNumber
        ),
}): any);

export const emailSchema = (sharedSchema.shape({
    toEmail: yup.string().required().email("Invalid email address"),
}): any);

export type MessageRequestSchema = typeof smsSchema | typeof emailSchema

export function getShareReqSchema(messageType: MessageType): MessageRequestSchema {
    if (messageType === "SMS") {
        return smsSchema
    } else {
        return emailSchema
    }
}

// $FlowIgnore we can type this nicely when moving to typescript using Yup's InferType
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
            // $FlowIgnore flow is out of date and replaceAll exists
            .replaceAll(/[ ()-]/g, "")
            .replaceAll(
                /[ ()-+]/g,
                // If we match with a leading + then add that + back
                (match, offset, all) => (
                    match === "+" && offset === 0 ? match : ""
                )
            )
            .replace(/^0/, "+61");
    }

    return phoneNumber
        // RegEx must be created via a string rather than a literal otherwise
        // it will bork browsers that don't support lookbehinds even if those
        // browsers never execute this line.
        // $FlowIgnore flow is out of date and replaceAll exists
        .replaceAll(new RegExp("(?:[ ()-]|(?<!^)\\+)", "g"), "")
        .replace(/^0/, "+61");
}

export function verifyPhoneNumber(phoneNumber: string): boolean {
    let hasNonLeadingPlus = false

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
