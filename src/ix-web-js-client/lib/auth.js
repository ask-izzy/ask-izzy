/* @flow */
import fetch from 'node-fetch';
import {request} from "./requests.js"

export async function getToken(
    endpointUrl: string,
    username: string,
    password: string,
) {
    const json = await request(
        endpointUrl,
        "POST",
        {},
        {username, password}
    )
    console.log(json)
    return json
}
