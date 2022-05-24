/* @flow */
import {
    getRequestWithToken,
} from "../../lib/requests.js"
import {addSearchParamsToUrl} from "../../lib/urls.js"

export type ISS3ClientProps = {
    key: string,
    baseUrl: string
}

export type ISS3SearchResultsMeta = {
    total_count: number,
    limit: number,
    offset: number,

    previous: ?string,
    next: ?string,
}

export type ISS3SearchResults = {
    meta: ISS3SearchResultsMeta,
    objects: Array<Object>,
}

export type ISS3AreaLocation = {
    name: string,
    kind: string,
    postcode: string,
    state: string,
    suburb: string,
}

export type ISS3LocationSearchResults = {
    meta: ISS3SearchResultsMeta,
    objects: Array<ISS3AreaLocation>,
}

export type ISS3SearchQuery = {|
    age_group?: string | string[],
    area?: string | string[],
    catchment?: string | string[],
    client_gender?: string | string[],
    limit: number,
    offset?: number,
    location?: string,
    minimum_should_match?: string,
    q?: string,
    service_type?: string | string[],
    service_type_raw?: string | string[],
    type?: string,
    site_id?: number,
    show_in_askizzy_health?: boolean,
    is_bulk_billing?: boolean,
    name?: string,
|};

export type ISS3SearchQueryWithDefaults = {|
    ...ISS3SearchQuery,
    type?: $PropertyType<ISS3SearchQuery, 'type'>,
    limit?: $PropertyType<ISS3SearchQuery, 'limit'>
|};

export type ISS3LocationSearchQuery = {|
    name: string,
    kind: Array<string>
|}

export class ISS3Client {
    baseUrl: string
    authString: string;

    constructor({baseUrl, key}: ISS3ClientProps) {
        this.baseUrl = baseUrl
        this.authString = `Basic ${btoa(key)}`
    }

    async search(
        query: ISS3SearchQueryWithDefaults
    ): Promise<ISS3SearchResults | null> {
        const queryWithDefaults = {
            type: "service",
            limit: 10,
            ...query,
        }

        try {
            const url = new URL("/api/v3/search/", this.baseUrl)

            addSearchParamsToUrl(url, queryWithDefaults)
            return getRequestWithToken<ISS3SearchResults>(
                url.href,
                this.authString
            )

        } catch (error) {
            console.error(error)
            // We don't currently worry if request failed
            return null
        }
    }

    async getService(serviceId: number): Promise<Object> {
        const url = new URL(`/api/v3/service/${serviceId}/`, this.baseUrl)
        return getRequestWithToken(url.href, this.authString)
    }

    async searchLocations(
        query: ISS3LocationSearchQuery
    ): Promise<ISS3LocationSearchResults> {
        const url = new URL(`/api/v3/location/search/`, this.baseUrl)
        addSearchParamsToUrl(url, query)
        return getRequestWithToken<ISS3LocationSearchResults>(
            url.href,
            this.authString
        )
    }
}
