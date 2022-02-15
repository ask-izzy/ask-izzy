/* @flow */
import {
    getRequest,
} from "../lib/requests.js"
import {addSearchParamsToUrl} from "../lib/urls.js"

type Props = {
    key: string,
    baseUrl: string
};

type searchResultsMeta = {
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
    key: string,
    limit: number,
    offset: number,
    location?: string,
    minimum_should_match?: string,
    q?: string,
    service_type?: string | string[],
    type?: string,
    site_id?: number,
    show_in_askizzy_health?: boolean,
    is_bulk_billing?: boolean
|};

type ISS3LocationSearchQuery = {|
    name: string,
    kind: Array<string>
|}

export class ISS3Client {
    key: string;
    baseUrl: string

    constructor({key, baseUrl}: Props) {
        this.key = key
        this.baseUrl = baseUrl
    }

    async search(query: ISS3SearchQuery): Promise<searchResults | null> {
        const queryWithDefaults = {
            type: "service",
            limit: 10,
            key: this.key,
            ...query,
        }

        try {
            const url = new URL("/api/v3/search/", this.baseUrl)

            addSearchParamsToUrl(url, queryWithDefaults)
            return getRequest<searchResults>(url.href)

        } catch (error) {
            // We don't currently worry if request failed
            return null
        }
    }

    async getService(serviceId: number): Object {
        const url = new URL(`/api/v3/service/${serviceId}/`, this.baseUrl)
        url.searchParams.append("key", this.key)
        return getRequest(url.href)
    }

    async searchLocations(
        query: ISS3LocationSearchQuery
    ): Promise<locationSearchResults> {
        const url = new URL(`/api/v3/location/search/`, this.baseUrl)
        addSearchParamsToUrl(url, query)
        return getRequest<locationSearchResults>(url.href)
    }
}
