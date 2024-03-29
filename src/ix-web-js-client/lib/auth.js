/* @flow */
import {request} from "./requests.js"

export async function getToken<TokenBody = any>(
    endpointUrl: string,
    username: string,
    password: string,
): Promise<TokenBody> {
    const json = await request<TokenBody>(
        endpointUrl,
        "POST",
        {},
        {username, password}
    )
    return json
}
