/* @flow */
export async function getRequest<Res = any>(
    url: string
): Promise<Res> {
    return request(url, "GET")
}

export async function postRequest<Res = any, Payload = Object>(
    url: string,
    payload: Payload
): Promise<Res> {
    return request(url, "POST", {}, payload)
}

export async function getRequestWithToken<Res = any>(
    url: string,
    authString: string,
): Promise<Res> {
    return request(url, "GET", {Authorization: authString})
}

export async function postRequestWithToken<Res = any, Payload = Object>(
    url: string,
    authString: string,
    payload: Payload
): Promise<Res> {
    return request(url, "POST", {Authorization: authString}, payload)
}

export async function request<ResBody = Object, ReqPayload = Object>(
    url: string,
    method: "POST" | "GET",
    headers?: HeadersInit,
    payload?: ReqPayload
): Promise<ResBody> {
    const options: RequestOptions = {
        method,
        headers: {
            ...headers,
            "Content-Type": "application/json",
        },
        redirect: "follow",
    }
    if (payload) {
        options.body = JSON.stringify(payload)
    }
    const res = await fetch(url, options)
    if (res.status < 200 || res.status >= 300) {
        console.info(url, options)
        throw Error(
            `Got error status ${res.status} for ${url}: ${await res.text()}`
        )
    }
    return await res.json()
}
