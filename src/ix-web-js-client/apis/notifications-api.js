/* @flow */
import {request, postRequestWithToken} from "../lib/requests.js"
type ClientProps = {
    baseUrl: string;
} & (
    {
        password: string;
        username: string;
    }
    |
    {
        apiKey: string;
    }
)

export default async function createClient(
    props: ClientProps
): Promise<NotificationsApiClient> {
    const client = new NotificationsApiClient(props)
    // Pe-fetch auth token if required
    await client.getAuthString()
    return client
}

type SendNotificationRequest = {
    action: string,
    environment: string,
    provider: string,
    notifications: {
        template: string,
        notifications: [
            {
                to: string,
                from: string,
                replacements: { [key: string]: string}
            }
        ]
    }
}

type SendNotificationResponse = {
    task_id: string,
    task_status: string,
    task_result: any
}

class NotificationsApiClient {
    baseUrl: string;
    password: string;
    username: string;
    apiKey: string;
    token: string;
    tokenExpiry: Date;

    constructor(props: ClientProps) {
        // We know that if username exists then so must password but flow is stupid and dumb.
        // I checked and typescript can handle this situation correctly. I'm so ready to move
        // to typescript already :/
        // $FlowIgnore
        if (props.username) {
            // $FlowIgnore
            this.username = props.username
            // $FlowIgnore
            this.password = props.password
        } else {
            // $FlowIgnore
            this.apiKey = props.apiKey
        }
        this.baseUrl = props.baseUrl
    }

    async getAuthString(): Promise<string> {
        if (this.apiKey) {
            return `Api-Key ${this.apiKey}`
        } else {
            if (!this.token || this.tokenExpiry > new Date()) {
                const url = new URL("token/", this.baseUrl).href
                const res = await request(url, "POST", {}, {
                    username: this.username,
                    password: this.password,
                })
                this.token = res.access
                // Expire after 30 min
                this.tokenExpiry = new Date(Date.now() + 30 * 60 * 1000)
            }
            return `Bearer ${this.token}`
        }
    }

    async send(request: SendNotificationRequest): Promise<SendNotificationResponse> {
        const url = new URL("/api/v1/message/send/", this.baseUrl)
        return postRequestWithToken<SendNotificationResponse>(
            url.href,
            await this.getAuthString(),
            request
        )
    }
}
