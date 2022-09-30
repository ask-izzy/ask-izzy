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

export type ISS4ClientType = {
    authString: string,
    baseUrl: string,
    search: (ISS4SearchProps) => Promise<ISS4SearchResults>,
    getService: (number) => Promise<any>,
}


function ISS4Client({token, baseUrl}: ISS4ClientProps): ISS4ClientType {
    return {
        baseUrl,
        authString: `Token ${token}`,
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
        },

        async getService(serviceId: number): Promise<any> {
            const url = new URL(
                `/api/directory/services/${serviceId}/`,
                this.baseUrl
            ).href
            return getRequestWithToken(url, this.authString)
        },
    }
}

export default ISS4Client
