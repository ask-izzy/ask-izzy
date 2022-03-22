/* @flow */

import createClient from "../ix-web-js-client/apis/iss"
import type {ISS3Client} from "../ix-web-js-client/apis/iss/v3"
import type {ISS4Client} from "../ix-web-js-client/apis/iss/v4"

let iss3Client: ISS3Client,
    iss4Client: ISS4Client;

declare function getIssClient(version: "3"): Promise<ISS3Client>
declare function getIssClient(version: "4"): Promise<ISS4Client>

async function getIssClient(
    version: "3" | "4"
): Promise<ISS3Client | ISS4Client> {
    if (version === "3") {
        if (!iss3Client) {
            iss3Client = await createClient(
                {
                    baseUrl: window.ISS_BASE_URL,
                    key: window.ISS_API_KEY,
                },
                "3"
            )
        }
        return iss3Client
    } else {
        if (!iss4Client) {
            iss4Client = await createClient(
                {
                    baseUrl: window.ISS_BASE_URL,
                    token: window.ISS_API_TOKEN,
                },
                "4"
            )
        }
        return iss4Client
    }
}

export {getIssClient}
