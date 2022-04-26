/* @flow */

import createClient, {createISS3Client} from "../ix-web-js-client/apis/iss"
import type {ISS3Client, ISS4Client} from "../ix-web-js-client/apis/iss"

let issClient: ISS4Client,
    iss3Client: ISS3Client;

export async function getIssClient(): Promise<ISS4Client> {
    if (!issClient) {
        issClient = await createClient({
            token: window.ISS_API_TOKEN,
            baseUrl: window.ISS_BASE_URL,
        })
    }
    return issClient
}

export async function getIss3Client(): Promise<ISS3Client> {
    if (!iss3Client) {
        iss3Client = await createISS3Client({
            key: window.ISS3_API_KEY,
            baseUrl: window.ISS3_BASE_URL,
        })
    }
    return iss3Client
}
