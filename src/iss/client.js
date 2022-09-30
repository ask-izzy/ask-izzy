/* @flow */

import createClient from "../ix-web-js-client/apis/iss"
import type {ISS3ClientType} from "../ix-web-js-client/apis/iss/v3"
import type {ISS4ClientType} from "../ix-web-js-client/apis/iss/v4"

export function getIssVersion(): "3" | "4" {
    const issVersion = process.env.NEXT_PUBLIC_ISS_VERSION
    if (["3", "4"].includes(issVersion)) {
        // It's necessary to restate the value to keep flow happy :/
        return issVersion === "3" ? "3" : "4"
    } else {
        throw Error(`Unknown ISS version: ${issVersion}`)
    }
}

let iss3Client: ISS3ClientType,
    iss4Client: ISS4ClientType;

declare function getIssClient(version: "3"): Promise<ISS3ClientType>
declare function getIssClient(version: "4"): Promise<ISS4ClientType>

async function getIssClient(
    version: "3" | "4"
): Promise<ISS3ClientType | ISS4ClientType> {
    if (version === "3") {
        if (!iss3Client) {
            iss3Client = await createClient(
                {
                    baseUrl: process.env.NEXT_PUBLIC_ISS_BASE_URL,
                    key: process.env.NEXT_PUBLIC_ISS_API_KEY,
                },
                "3"
            )
        }
        return iss3Client
    } else {
        if (!iss4Client) {
            iss4Client = await createClient(
                {
                    baseUrl: process.env.NEXT_PUBLIC_ISS_BASE_URL,
                    token: process.env.NEXT_PUBLIC_ISS_API_TOKEN || "<not set>",
                },
                "4"
            )
        }
        return iss4Client
    }
}

export {getIssClient}
