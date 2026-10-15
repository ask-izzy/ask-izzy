import createClient from "../ix-web-js-client/apis/iss"
import type {ISS4Client} from "../ix-web-js-client/apis/iss/v4"

let issClient: ISS4Client

export async function getIssClient(): Promise<ISS4Client> {
    if (!issClient) {
        issClient = createClient({
            baseUrl: process.env.NEXT_PUBLIC_ISS_BASE_URL,
            token: process.env.NEXT_PUBLIC_ISS_API_TOKEN,
        })
    }
    return issClient
}
