/* @flow */

import createClient from "../ix-web-js-client/apis/iss"
import type {ISS3Client} from "../ix-web-js-client/apis/iss/v3"
import type {ISS4Client} from "../ix-web-js-client/apis/iss/v4"

export function getIssVersion(): "3" | "4" {
    const issVersion = window.ISS_VERSION
    if (["3", "4"].includes(issVersion)) {
        return issVersion
    } else {
        throw Error(`Unknown ISS version: ${issVersion}`)
    }
}

let iss3Client: ISS3Client,
    iss4Client: ISS4Client;

declare function getIssClient(version: "3"): ISS3Client
declare function getIssClient(version: "4"): ISS4Client

function getIssClient(
    version: "3" | "4"
): ISS3Client | ISS4Client {
    if (version === "3") {
        if (!iss3Client) {
            iss3Client = createClient(
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
            iss4Client = createClient(
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
