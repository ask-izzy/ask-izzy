import type {NextRouter} from "next/router"
import objectHash from "object-hash"
import {$Shape} from "utility-types"

import Service from "@/src/iss/Service.js"
import storage from "@/src/storage.js"
import {getIssClient, getIssVersion} from "@/src/iss/client.js"
import type {
    ISS4SearchQuery,
    ISS4SearchResultsMeta,
} from "@/src/ix-web-js-client/apis/iss/v4.js"
import type {
    ISS3SearchQuery,
    ISS3SearchResultsMeta,
} from "@/src/ix-web-js-client/apis/iss/v3.js"
import type {SearchQuery as IzzySearchQuery} from "@/src/iss/searchQueryBuilder.js"

export const previousSearchQueryStorageKey = "previousSearchQuery"

const cachedServiceSearches: Record<string, PaginatedSearch> = {}

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
    readonly loadNextPage: () => Promise<void>
    readonly loadedServices: Array<Service>
    readonly numOfPagesLoaded: number
    readonly issQuery: ISS4SearchQuery | ISS3SearchQuery
    readonly isNext: boolean | null | undefined
}

export class PaginatedSearchIss3 implements PaginatedSearch {
    #pagesLoaded = 0;
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
                serviceData => new Service(serviceData),
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

    get isNext(): boolean | null {
        return Boolean(this._lastMeta?.next)
    }
}

export class PaginatedSearchIss4 implements PaginatedSearch {
    #pagesLoaded = 0;
    #maxPageSize: number;
    #loadedServices: Array<Service> = [];

    #izzyQuery: IzzySearchQuery
    #issQuery: ISS4SearchQuery;
    _lastMeta: ISS4SearchResultsMeta;

    constructor(query: IzzySearchQuery) {
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
                serviceData => new Service(serviceData),
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

    get isNext(): boolean | null {
        return Boolean(
            this._lastMeta?.page.current < this._lastMeta?.page.total_pages,
        )
    }
}

export function isDisabilityAdvocacySearch(
    router: NextRouter,
): boolean {
    return decodeURIComponent(router.query.search as string) ===
        "Disability Advocacy Providers"
}

export function convertIzzySearchQueryToIss(
    query: IzzySearchQuery,
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
            }),
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
                },
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
    query: IzzySearchQuery,
): ISS3SearchQuery {
    const issQuery: $Shape<ISS3SearchQuery> = {}

    let q = query.term?.join(" ") || ""

    // These tweaks don't change behaviour of any of the queries, purely the
    // formatting. They are used replicate some of the legacy formatting
    // behaviour of the old query system so the output of the queries before
    // and after the change can be diffed to detect any actual behaviour
    // changes.
    if (
        q === "-\"coordinating bodies\" -\"fire-fighting\" " +
            "service_type:Child Protection/ Placement"
    ) {
        q = " -\"coordinating bodies\" -\"fire-fighting\" " +
            "service_type:Child Protection/ Placement"
    } else if (
        q.startsWith(
            "-\"coordinating bodies\" -\"holiday accommodation\" " +
                "\"Homelessness Access Point\"",
        )
    ) {
        q = q.replace(
            "-\"coordinating bodies\" -\"holiday accommodation\" " +
                "\"Homelessness Access Point\"",
            " -\"coordinating bodies\"    -\"holiday accommodation\"  " +
                "\"Homelessness Access Point\"",
        )
    } else if (q.startsWith("meals -\"home care\"")) {
        q = q.replace(
            "meals -\"home care\"",
            "meals  -\"home care\"",
        )
    } else if (
        q.startsWith(
            "-\"coordinating bodies\" -\"fire-fighting\" " +
                "\"men's behaviour change\"",
        )
    ) {
        q = q.replace(
            "-\"coordinating bodies\" -\"fire-fighting\" " +
                "\"men's behaviour change\"",
            " -\"coordinating bodies\" -\"fire-fighting\"  " +
                "\"men's behaviour change\"",
        )
    } else if (q.startsWith("legal -\"coordinating bodies\"")) {
        q = q.replace(
            "legal -\"coordinating bodies\"",
            "legal  -\"coordinating bodies\"",
        )
    } else if (
        q.match(
            "-\"assistance with meals\" -\"hire of facilities\" " +
                "-\"meal preparation\"",
        )
    ) {
        q = " " + q
        q = q.replace(
            "-\"assistance with meals\" -\"hire of facilities\" " +
                "-\"meal preparation\"",
            " -\"assistance with meals\" -\"hire of facilities\"  " +
                "-\"meal preparation\"",
        )
    } else if (q.startsWith("-\"coordinating bodies\"")) {
        q = " " + q
    } else if (q.startsWith("-research")) {
        q = "  " + q
    }

    q = q.replace(/"(.*?)"/g, "($1)")

    if (q === "(centrelink)") {
        q = "\"centrelink\""
    } else if (q.match(/name:\(financial counselling\)/)) {
        q = q.replace(
            /name:\(financial counselling\)/,
            "name:\"financial counselling\"",
        )
    }

    if (q) {
        issQuery.q = q
    }

    if (query.siteId) {
        issQuery.site_id = query.siteId
    }

    if (query.serviceTypes) {
        issQuery.service_type = query.serviceTypes.map(
            serviceType => serviceType !== "Homelessness Access Point" ?
                serviceType.toLowerCase()
                : serviceType,
        )
    }

    if (query.serviceTypesRaw) {
        issQuery.service_type_raw = query.serviceTypesRaw.join(" ")
    }

    if (query.minimumShouldMatch) {
        issQuery.minimum_should_match = query.minimumShouldMatch
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
            }[gender]),
        )
    }

    if (query.ageGroups) {
        issQuery.age_group = query.ageGroups.map(
            ageGroup => ageGroup.toLowerCase().split(/[ -]/).join(""),
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

    return (issQuery as ISS3SearchQuery)
}
