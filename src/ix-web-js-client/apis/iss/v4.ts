import {
    getRequestWithToken,
} from "../../lib/requests"
import {addSearchParamsToUrl} from "../../lib/urls"

export type ISS4ClientProps = {
    baseUrl: string,
    token: string,
}

// Params accepted by /api/directory/search/. See the "search_retrieve"
// operation in the ISS4 API docs for full details. Any param can be given
// multiple values in which case they are OR'd together.
export type ISS4SearchQuery = {
    "entity-type"?: string | string[],
    "search-terms"?: string | string[],
    site?: string | string[],
    name?: string | string[],
    "service-type"?: string | string[],
    "is-cald-specific"?: boolean,
    "target-gender"?: string | string[],
    "age-group"?: string | string[],
    "indigenous-classification"?: string | string[],
    catchment?: string | string[],
    "prefer-catchment"?: string | string[],
    "located-near"?: string,
    limit?: number,
    offset?: number,
    fields?: string[],
    // Allow any other supported param to be passed through (eg when using
    // the debug ISS query override)
    [param: string]: unknown,
}

export type ISS4SearchResultsMeta = {
    // Total number of records matching the query
    count: number,
    // Number of records which can actually be paged through (results are
    // capped by ISS)
    count_available: number,
    next: string | null,
    prev: string | null,
}

export type ISS4SearchResults = ISS4SearchResultsMeta & {
    results: Array<any>,
}

export class ISS4Client {
    baseUrl: string
    authString: string;

    constructor({token, baseUrl}: ISS4ClientProps) {
        this.baseUrl = baseUrl
        this.authString = `Token ${token}`
    }

    async search(query: ISS4SearchQuery): Promise<ISS4SearchResults> {
        const {fields, ...params} = {
            "entity-type": "service",
            limit: 10,
            ...query,
        }

        const url = new URL("/api/directory/search/", this.baseUrl)
        addSearchParamsToUrl(url, params)
        if (fields) {
            url.searchParams.set("fields", fields.join(","))
        }
        return getRequestWithToken<ISS4SearchResults>(
            url.href,
            this.authString
        )
    }

    async getService(serviceId: number, fields?: string[]): Promise<any> {
        const url = new URL(
            `/api/directory/services/${serviceId}/`,
            this.baseUrl
        )
        if (fields) {
            url.searchParams.set("fields", fields.join(","))
        }
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
