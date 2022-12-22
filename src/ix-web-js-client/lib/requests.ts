// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
type Headers = Record<string, string>;

export async function getRequest<Res = any>(
    url: string,
): Promise<Res> {
    return request(url, "GET")
}

export async function postRequest<Res = any, Payload = Record<string, unknown>>(
    url: string,
    payload: Payload,
): Promise<Res> {
    return request(url, "POST", {}, payload)
}

export async function getRequestWithToken<Res = any>(
    url: string,
    authString: string,
): Promise<Res> {
    return request(url, "GET", {Authorization: authString})
}

export async function postRequestWithToken<Res = any, Payload = Record<string, unknown>>(
    url: string,
    authString: string,
    payload: Payload,
): Promise<Res> {
    return request(url, "POST", {Authorization: authString}, payload)
}

export async function request<ResBody = Record<string, unknown>, ReqPayload = Record<string, unknown>>(
    url: string,
    method: "POST" | "GET",
    headers?: Headers,
    payload?: ReqPayload,
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
        const statusCode = res.status
        const resBodyText = await res.text()
        let resBodyJSON: any = null
        try {
            resBodyJSON = JSON.parse(resBodyText)
        } catch (error) {
            // Body might not be JSON so we don't care if this fails
        }
        const error = Error(
            `Got error status "${statusCode}" for <${url}>:\n\t` +
                `${resBodyText}`,
        )

        error.statusCode = statusCode
        error.resBodyText = resBodyText
        error.resBodyJSON = resBodyJSON
        error.url = url
        throw error
    }
    return await res.json()
}
