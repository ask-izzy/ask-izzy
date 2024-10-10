/* @flow */
import type { NextRouter } from "next/router";

import objectHash from "object-hash"
import Service from "./Service";
import storage from "../storage";
import {getIssClient, getIssVersion} from "./client"
import type {
    ISS4SearchQuery,
    ISS4SearchResultsMeta,
} from "../ix-web-js-client/apis/iss/v4"
import type {
    ISS3SearchQuery,
    ISS3SearchResultsMeta,
} from "../ix-web-js-client/apis/iss/v3"
import type {SearchQuery as IzzySearchQuery} from "./searchQueryBuilder"

export const previousSearchQueryStorageKey = "previousSearchQuery"

const cachedServiceSearches: {[string]: PaginatedSearch} = {}

export function createServiceSearch(query: IzzySearchQuery): PaginatedSearch {
    let search: PaginatedSearch
    const hash = objectHash(query)
    if (cachedServiceSearches[hash]) {
        search = cachedServiceSearches[hash]
    } else {
        const issVersion = getIssVersion()
        if (issVersion === "3") {
            search = new PaginatedSearchIss3(query)
        } else if (issVersion === "4") {
            search = new PaginatedSearchIss4(query)
        } else {
            throw new Error(`Api version "${issVersion}" not recognised`)
        }
        cachedServiceSearches[hash] = search
    }
    return search
}

export class PaginatedSearch {
    +loadNextPage: () => Promise<void>;
    +loadedServices: Array<Service>;
    +numOfPagesLoaded: number;
    +issQuery: ISS4SearchQuery | ISS3SearchQuery
    +izzyQuery: IzzySearchQuery
    +isNext: ?boolean
}

export class PaginatedSearchIss3 extends PaginatedSearch {
    // When we move to typescript we can defined them in the parent using the protected
    // keyword and inherit them here so we don't need to define in every child
    #pagesLoaded: number = 0;
    #maxPageSize: number;
    #loadedServices: Array<Service> = [];

    #izzyQuery: IzzySearchQuery
    #issQuery: ISS3SearchQuery;
    // WARNING: From some wack reason eslint panics if this is a private class
    // member. I this is fixed in a later version of eslint or one of the eslint
    // plugins but upgrading it now introduced too much noise into this MR so
    // leaving that for later.
    _lastMeta: ISS3SearchResultsMeta;

    constructor(query: IzzySearchQuery) {
        super()
        const {maxPageSize = 10, ...remainingQuery} = query
        this.#maxPageSize = maxPageSize
        let issQuery
        if (
            storage.getDebug() &&
            storage.getJSON("issParamsOverride")
        ) {
            issQuery = storage.getJSON("issParamsOverride")
        } else {
            issQuery = convertIzzySearchQueryToIss3(remainingQuery)
        }
        this.#izzyQuery = query
        this.#issQuery = issQuery
    }

    async loadNextPage() {
        const iss3Client = await getIssClient("3")
        const offset = this.#pagesLoaded * this.#maxPageSize
        const res = await iss3Client.search({
            ...this.#issQuery,
            ...(offset ? {offset} : undefined),
            limit: this.#maxPageSize,
        })
        if (res) {
            this._lastMeta = res.meta
            const services = res.objects.map(
                serviceData => new Service(serviceData)
            ) || []
            this.#loadedServices.push(...services)
            this.#pagesLoaded++;
        }

    }

    get loadedServices(): Array<Service> {
        return this.#loadedServices
    }

    get numOfPagesLoaded(): number {
        return this.#pagesLoaded
    }

    get issQuery(): ISS3SearchQuery {
        return this.#issQuery
    }

    get izzyQuery(): IzzySearchQuery {
        return this.#izzyQuery
    }

    get isNext(): ?boolean {
        return Boolean(this._lastMeta?.next)
    }
}

export class PaginatedSearchIss4 extends PaginatedSearch {
    // When we move to typescript we can defined them in the parent using the protected
    // keyword and inherit them here so we don't need to define in every child
    #pagesLoaded: number = 0;
    #maxPageSize: number;
    #loadedServices: Array<Service> = [];

    #izzyQuery: IzzySearchQuery
    #issQuery: ISS4SearchQuery;
    _lastMeta: ISS4SearchResultsMeta;

    constructor(query: IzzySearchQuery) {
        super()
        const {maxPageSize = 10, ...remainingQuery} = query
        this.#maxPageSize = maxPageSize

        let issQuery
        if (
            storage.getDebug() &&
            storage.getJSON("issParamsOverride")
        ) {
            issQuery = storage.getJSON("issParamsOverride")
        } else {
            issQuery = convertIzzySearchQueryToIss(remainingQuery)
        }
        this.#izzyQuery = query,
        this.#issQuery = issQuery
    }

    async loadNextPage() {
        const issClient = await getIssClient("4")
        const res = await issClient.search({
            ...this.#issQuery,
            page: {
                current: this.#pagesLoaded + 1,
                size: this.#maxPageSize,
            },
        })

        if (res) {
            this._lastMeta = res.meta
            const services = res.objects.map(
                serviceData => new Service(serviceData)
            ) || []
            this.#loadedServices.push(...services)
            this.#pagesLoaded++;
        }
    }

    get loadedServices(): Array<Service> {
        return this.#loadedServices
    }

    get numOfPagesLoaded(): number {
        return this.#pagesLoaded
    }

    get issQuery(): ISS4SearchQuery {
        return this.#issQuery
    }

    get izzyQuery(): IzzySearchQuery {
        return this.#izzyQuery
    }

    get isNext(): ?boolean {
        return Boolean(
            this._lastMeta?.page.current < this._lastMeta?.page.total_pages
        )
    }
}

export function isDisabilityAdvocacySearch(
    router: NextRouter
): boolean {
    return decodeURIComponent(router.query.categoryOrContentPageSlug) ===
        "disability-advocacy-finder"
}
//cald_specifc needs to be set for ISS4
export function convertIzzySearchQueryToIss(
    query: IzzySearchQuery
): ISS4SearchQuery {
    const issQuery: ISS4SearchQuery = {
        filters: {
            all: [
                {
                    object_type: "Service",
                },
            ],
        },
        boosts: {
            is_crisis: {
                type: "value",
                value: "true",
                operation: "multiply",
                factor: 1.5,
            },
        },
    }

    if (query.term) {
        issQuery.query = query.term.join(" ")
    }

    if (query.serviceTypes) {
        issQuery.filters?.all?.push({
            service_types: query.serviceTypes,
        })
    }

    if (query.clientGenders) {
        const genderBoost = query.clientGenders.map(
            gender => ({
                factor: 1.5,
                operation: "multiply",
                type: "value",
                value: gender,
            })
        )
        if (!issQuery.boosts) {
            issQuery.boosts = {}
        }
        issQuery.boosts.target_gender = genderBoost
    }

    if (query.location) {
        const location = query.location
        const state = location.name.match(/, (\w+)$/)?.[1]

        if (!issQuery.boosts) {
            issQuery.boosts = {}
        }
        issQuery.boosts.location_state = {
            type: "value",
            value: state,
            operation: "multiply",
            factor: 1.5,
        }
        const coordinates = location.coordinates
        if (coordinates) {
            const center = `${coordinates.latitude},${coordinates.longitude}`
            issQuery.boosts.location_approximate_geopoint = [
                {
                    type: "proximity",
                    function: "linear",
                    center,
                    factor: 7,
                },
            ]

            issQuery.filters?.all?.push(
                {
                    location_approximate_geopoint: {
                        center,
                        distance: 300,
                        unit: "km",
                    },
                }
            )
        }
    }

    return issQuery
}

// Since this function is responsible for mapping a whole bunch of properties
// that may exist in IzzySearchQuery there are lot of if statements used
// which trip eslint's complexity rule. However due to the nature of these
// mappings each of these if statements that map a property should be pretty
// self-contained so this function shouldn't actually be a complex as it appears
// eslint.
// eslint-disable-next-line complexity
export function convertIzzySearchQueryToIss3(
    query: IzzySearchQuery
): ISS3SearchQuery {
    const issQuery: $Shape<ISS3SearchQuery> = {}

    if (query.term) {
        issQuery.q = query.term.join(" ").replace(/"(.*?)"/g, "($1)")
    }

    if (query.siteId) {
        issQuery.site_id = query.siteId
    }

    if (query.serviceTypes) {
        issQuery.service_type = query.serviceTypes.map(
            serviceType => serviceType.toLowerCase()
        )
    }

    if (query.serviceTypesRaw) {
        issQuery.service_type_raw = query.serviceTypesRaw
    }

    if (query.minimumShouldMatch) {
        issQuery.minimum_should_match = query.minimumShouldMatch
    }

    if (query.caldSpecific) {
        issQuery.cald_specific = query.caldSpecific
    }

    if (query.showInAskIzzyHealth) {
        issQuery.show_in_askizzy_health = query.showInAskIzzyHealth
    }

    if (query.clientGenders) {
        issQuery.client_gender = query.clientGenders.map(
            gender => ({
                Female: "f",
                Male: "m",
                Diverse: "x",
                unspecified: "u",
            }[gender])
        )
    }

    if (query.ageGroups) {
        issQuery.age_group = query.ageGroups.map(
            ageGroup => ageGroup.toLowerCase().split(/[ -]/).join("")
        )
    }

    if (query.catchment) {
        issQuery.catchment = query.catchment
    }

    if (query.location) {
        issQuery.area = query.location.name
        if (query.location.coordinates) {
            issQuery.location = `${query.location.coordinates.longitude}E` +
                `${query.location.coordinates.latitude}N`
        }
    }

    if (query.name) {
        issQuery.name = query.name
    }

    return issQuery
}
