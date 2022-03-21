/* @flow */
import {
    getRequestWithToken,
} from "../lib/requests.js"
import {addSearchParamsToUrl} from "../lib/urls.js"

type Props = {
    key: string,
    baseUrl: string
};

export type searchResultsMeta = {
    total_count: number,
    limit: number,
    offset: number,

    previous: ?string,
    next: ?string,
};
type searchResults = {
    meta: searchResultsMeta,
    objects: Array<Object>,
}
export type areaLocation = {
    name: string,
    kind: string,
    postcode: string,
    state: string,
    suburb: string,
}

type locationSearchResults = {
    meta: searchResultsMeta,
    objects: Array<areaLocation>,
}

export function createISS3Client(props: Props): ISS3Client {
    const client = new ISS3Client(props)
    return client
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

type ISS3SearchQueryWithDefaults = {|
    ...ISS3SearchQuery,
    type?: $PropertyType<ISS3SearchQuery, 'type'>,
    limit?: $PropertyType<ISS3SearchQuery, 'limit'>
|};

type ISS3LocationSearchQuery = {|
    name: string,
    kind: Array<string>
|}

export class ISS3Client {
    baseUrl: string
    authString: string;

    constructor({baseUrl, key}: Props) {
        this.baseUrl = baseUrl
        this.authString = `Basic ${btoa(key)}`
    }

    async search(
        query: ISS3SearchQueryWithDefaults
    ): Promise<searchResults | null> {
        const queryWithDefaults = {
            type: "service",
            limit: 10,
            ...query,
        }

        try {
            const url = new URL("/api/v3/search/", this.baseUrl)

            addSearchParamsToUrl(url, queryWithDefaults)
            return getRequestWithToken<searchResults>(url.href, this.authString)

        } catch (error) {
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
    ): Promise<locationSearchResults> {
        const url = new URL(`/api/v3/location/search/`, this.baseUrl)
        addSearchParamsToUrl(url, query)
        return getRequestWithToken<locationSearchResults>(
            url.href,
            this.authString
        )
    }
}
