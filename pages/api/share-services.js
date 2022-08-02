/* @flow */
import BadWordsFilter from "bad-words"

import {createNotificationsAPIClient} from "@/src/ix-web-js-client"
import {getService} from "@/src/iss/load-services"
import Service from "@/src/iss/Service"
import { sendSMS } from "@/src/utils/sms"
import { getRateLimitMiddlewares } from "@/src/utils/rate-limiting"
import { callMiddlewares } from "@/src/utils/middleware"
import {
    getRequestType,
    getShareMessage,
    normalisePhoneNumber,
} from "@/helpers/share-services.helpers.js"

const middlewares = getRateLimitMiddlewares({
    limit: 10,
    windowMs: 1000 * 60 * 30,
    delayAfter: 5,
    delayMs: 500,
})

// We'll type these correctly with typescript
export default async function handler(req: any, res: any): any {
    const body = req.body

    try {
        await callMiddlewares(middlewares, req, res)
    } catch {
        return res.status(429).json({ message: "Too many requests" })
    }

    const messageRequestType = await getRequestType(body)

    console.log(messageRequestType)

    if (!messageRequestType) {
        return res.status(400).json({message: "Invalid request"})
    }

    try {
        if (!validateCaptchaCode(req.body.captchaCode)) {
            return res.status(422).json({
                message: "Unprocessable request, Invalid captcha code",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(422).json({ message: "Something went wrong" });
    }

    let services: Array<Service>

    try {
        services = await Promise.all(
            body.services.map(id => getService(id))
        )
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Could not load details for services" });
    }

    const badWordsFilter = new BadWordsFilter()

    const abusiveLanguageUsed = [
        body.toName,
        body.fromName,
        body.fromRole,
    ].some(text => badWordsFilter.isProfane(text))

    if (abusiveLanguageUsed) {
        return res.status(403).json({ message: "Abusive language detected" })
    }

    try {
        const messageText = getShareMessage({
            services,
            baseUrl: `${process.env.SITE_PROTOCOL}://${process.env.SITE_DOMAIN.split("|")[0]}`,
            toName: body.toName,
            fromName: body.fromName,
            fromRole: body.fromRole,
            fromContactDetails: body.fromContactDetails,
            messageType: messageRequestType,
        })

        if (messageRequestType === "Email") {
            await sendEmail(
                body.toEmail,
                process.env.NEXT_PUBLIC_SITE_EMAIL,
                messageText.subject,
                // $FlowIgnore flow is out of date and replaceAll exists
                messageText.body
            )
        } else {
            const phoneNumber = normalisePhoneNumber(body.toPhoneNumber)
            await sendSMS(
                phoneNumber,
                messageText.body
            )
        }
    } catch (error) {
        console.log(error, error.status, error.statusCode, error.code);
        if (error.statusCode === 429) {
            return res.status(429).json({ message: "Too many requests to external service" });
        }
        return res.status(500).json({ message: "Could not send message" });
    }

    res.end()
}

async function validateCaptchaCode(captchaCode) {
    // Ping the google recaptcha verify API to verify the captcha code you received
    const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify` +
            `?secret=${process.env.RECAPTCHA_SECRET_KEY}` +
            `&response=${captchaCode}`,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
            },
            method: "POST",
        }
    );
    const captchaValidation = await response.json();
    /**
     * The structure of response from the veirfy API is
     * {
     *  "success": true|false,
     *  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
     *  "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
     *  "error-codes": [...]        // optional
         }
        */
    return captchaValidation.success
}

async function sendEmail(to, from, subject, body) {
    const notificationsAPIClient = await createNotificationsAPIClient({
        baseUrl: process.env.NEXT_PUBLIC_NOTIFICATIONS_API_BASE_URL,
        apiKey: process.env.NEXT_PUBLIC_NOTIFICATIONS_API_KEY,
    })

    await notificationsAPIClient.send({
        action: "email",
        environment: process.env.NEXT_PUBLIC_SHARE_SERVICES_EMAIL_ENVIRONMENT,
        provider: process.env.NEXT_PUBLIC_SHARE_SERVICES_EMAIL_PROVIDER,
        notifications: {
            template: process.env.NEXT_PUBLIC_SHARE_SERVICES_EMAIL_TEMPLATE,
            notifications: [
                {
                    to: to,
                    from: from,
                    replacements: {
                        subject: subject,
                        body: body,
                    },
                },
            ],
        },
    })
}
