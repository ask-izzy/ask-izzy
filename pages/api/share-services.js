/* @flow */
import {createNotificationsAPIClient} from "@/src/ix-web-js-client"

// We'll type these correctly with typescript
export default async function handler(req: any, res: any): any {
    // const secret = req.query.secret;
    // const path = req.query.slug;'

    const body = req.body
    console.log("body:", body)

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
