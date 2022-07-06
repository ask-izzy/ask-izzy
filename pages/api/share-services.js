/* @flow */
import {createNotificationsAPIClient} from "@/src/ix-web-js-client"

// We'll type these correctly with typescript
export default async function handler(req: any, res: any): any {
    // const secret = req.query.secret;
    // const path = req.query.slug;'

    const body = req.body
    console.log("body:", body)

    let captchaCodeIsValid

    try {
        captchaCodeIsValid = validateCaptchaCode(req.body.captchaCode)
    } catch (error) {
        console.log(error);
        return res.status(422).json({ message: "Something went wrong" });
    }

    if (captchaCodeIsValid) {
        return res.status(422).json({
            message: "Unproccesable request, Invalid captcha code",
        });

    }

    console.log("captchaCodeIsValid", captchaCodeIsValid)

    const notificationsAPIClient = await createNotificationsAPIClient({
        baseUrl: "https://notifications-api.docker.dev",
        apiKey: "JdGuT3Gr.sGv08CM6Jk3whfYutViqoObMHJvXacFN",
    })

    res.json(
        await notificationsAPIClient.send({
            "action": "email",
            "environment": "askizzy",
            "provider": "smtp",
            "notifications": {
                "template": "share-service-list",
                "notifications": [
                    {
                        "to": body.toEmail,
                        "from": "testing@infoxchange.net.au",
                        "replacements": {
                            "subject": "quick brown fox",
                            "object": "lazy dog",
                            "toName": body.toName,
                            fromName: body.fromName,

                        },
                    },
                ],
            },
        })
    )
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
