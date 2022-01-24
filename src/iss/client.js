/* @flow */

import createClient from "../ix-web-js-client/apis/iss"
import type {ISS4Client} from "../ix-web-js-client/apis/iss"

let issClient: ISS4Client;

export async function getIssClient(): Promise<ISS4Client> {
    if (!issClient) {
        issClient = await createClient({
            token: 'e6e988b62b52d85eaed1db6a22896dcea3eb1a681f541167e904a6a559b8640c',
            baseUrl: 'https://api-v4-uat.serviceseeker.com.au'
        })
    }
    return issClient
}
