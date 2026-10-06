type Headers = {[key: string]: string}

export async function getRequest<Res = any>(
    url: string
): Promise<Res> {
    return request(url, "GET")
}

export async function postRequest<Res = any, Payload = any>(
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

export async function postRequestWithToken<Res = any, Payload = any>(
    url: string,
    authString: string,
    payload: Payload
): Promise<Res> {
    return request(url, "POST", {Authorization: authString}, payload)
}

export async function request<ResBody = any, ReqPayload = any>(
    url: string,
    method: "POST" | "GET",
    headers?: Headers,
    payload?: ReqPayload
): Promise<ResBody> {
    const options: RequestInit = {
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
        let resBodyJSON = null
        try {
            resBodyJSON = JSON.parse(resBodyText)
        } catch (error) {
            // Body might not be JSON so we don't care if this fails
        }
        const error = Error(
            `Got error status "${statusCode}" for <${url}>:\n\t` +
                `${resBodyText}`
        )

        // Type correctly with typescript
        // @ts-expect-error TODO(ts-migration): Property 'statusCode' does not exist on type 'Error'.
        error.statusCode = statusCode
        // @ts-expect-error TODO(ts-migration): Property 'resBodyText' does not exist on type 'Error'.
        error.resBodyText = resBodyText
        // @ts-expect-error TODO(ts-migration): Property 'resBodyJSON' does not exist on type 'Error'.
        error.resBodyJSON = resBodyJSON
        // @ts-expect-error TODO(ts-migration): Property 'url' does not exist on type 'Error'.
        error.url = url
        throw error
    }
    return await res.json()
}
