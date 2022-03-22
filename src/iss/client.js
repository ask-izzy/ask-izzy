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
                    key: window.ISS3_API_KEY,
                    baseUrl: window.ISS3_BASE_URL,
                },
                "3"
            )
        }
        return iss3Client
    } else {
        if (!iss4Client) {
            iss4Client = await createClient(
                {
                    token: window.ISS_API_TOKEN,
                    baseUrl: window.ISS_BASE_URL,
                },
                "4"
            )
        }
        return iss4Client
    }
}

export {getIssClient}
