import {
    postRequestWithToken,
    getRequestWithToken,
} from "@/src/ix-web-js-client/lib/requests"

export type ISS4ClientProps = {
    baseUrl: string,
    token: string,
}

export type ISS4SearchQuery = {
    query?: string;
    page?: {
        current: number;
        size: number;
    };
    filters?: {
        all?: Array<Record<string, any>>;
    };
    boosts?: Record<string, Record<string, any>>;
};

export type ISS4SearchProps = {
    serialiser?: string,
} & ISS4SearchQuery

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
    objects: Array<Record<string, unknown>>,
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
            query,
        )
    }

    async getService(serviceId: number): Promise<Record<string, unknown>> {
        const url = new URL(
            `/api/directory/services/${serviceId}/`,
            this.baseUrl,
        ).href
        return getRequestWithToken(url, this.authString)
    }
}
