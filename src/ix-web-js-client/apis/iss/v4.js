/* @flow */
import {
    postRequestWithToken,
    getRequestWithToken,
} from "../../lib/requests.js"

export type ISS4ClientProps = {
    baseUrl: string,
    token: string,
}

export type ISS4SearchQuery = {|
    query?: string,
    page?: {
        current: number,
        size: number
    },
    filters?: {
        all?: Array<Object>
    },
    boosts?: {[string]: Object}
|}

export type ISS4SearchProps = {|
    serialiser?: string,
    ...ISS4SearchQuery
|}

export type ISS4SearchResultsMeta = {
    alerts: Array<any>,
    warnings: number,
    precision: number,
    page: {
        current: number,
        total_pages: number,
        total_results: number,
    },
    engine: {
        name: string,
        type: string
    },
    request_id: string
};

export type ISS4SearchResults = {
    meta: ISS4SearchResultsMeta,
    objects: Array<Object>,
}

export class ISS4Client {
    baseUrl: string
    authString: string;

    constructor({token, baseUrl}: ISS4ClientProps) {
        this.baseUrl = baseUrl
        this.authString = `Token ${token}`
    }

    async search({
        serialiser = "detail",
        ...query
    }: ISS4SearchProps): Promise<ISS4SearchResults> {
        const params = {
            serialiser,
        }

        const url = new URL("/api/search/", this.baseUrl)
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.append(key, String(value))
        }
        return postRequestWithToken<ISS4SearchResults>(
            url.href,
            this.authString,
            query
        )
    }

    async getService(serviceId: number): Object {
        const url = new URL(
            `/api/directory/services/${serviceId}/`,
            this.baseUrl
        )
        return getRequestWithToken(url.href, this.authString)
    }

    async getServiceTypes(
        options?: ISS4PageOfServiceOptionsType
    ): Promise<ISS4PageOfServiceType> {
        let searchParams = new URLSearchParams()
        if (options) {
            if (typeof options.nextPageUrl === "string") {
                const nextUrlObj = new URL(options.nextPageUrl)
                searchParams = nextUrlObj.searchParams
            } else {
                for (const key of ["limit", "offset"]) {
                    if (options[key]) {
                        searchParams.set(key, String(options[key]))
                    }
                }
            }
        }

        let url = new URL(
            `/api/directory/service-types/?${searchParams.toString()}`,
            this.baseUrl
        )

        return getRequestWithToken(url.href, this.authString)
    }
}

export type ISS4PageOfServiceOptionsType = {
    limit?: number,
    offset?: number,
    nextPageUrl?: string
}

export type ISS4PageOfServiceType = {
    count: number,
    next: string | null,
    previous: string | null,
    results: Array<ISS4ServiceType>
}

export type ISS4ServiceType = {
    id: number,
    name: string,
    children: Array<ISS4ServiceType>
}
