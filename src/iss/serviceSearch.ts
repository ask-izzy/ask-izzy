import type { NextRouter } from "next/router";

import objectHash from "object-hash"
import Service, {SEARCH_RESULT_FIELDS} from "./Service";
import storage from "../storage";
import {getIssClient} from "./client"
import type {
    ISS4SearchQuery,
    ISS4SearchResultsMeta,
} from "../ix-web-js-client/apis/iss/v4"
import type {SearchQuery as IzzySearchQuery} from "./searchQueryBuilder"

export const previousSearchQueryStorageKey = "previousSearchQuery"

const cachedServiceSearches: {[key: string]: PaginatedSearch} = {}

export function createServiceSearch(query: IzzySearchQuery): PaginatedSearch {
    const hash = objectHash(query)
    if (!cachedServiceSearches[hash]) {
        cachedServiceSearches[hash] = new PaginatedSearch(query)
    }
    return cachedServiceSearches[hash]
}

export class PaginatedSearch {
    #pagesLoaded: number = 0;
    #maxPageSize: number;
    #loadedServices: Array<Service> = [];

    #izzyQuery: IzzySearchQuery
    #issQuery: ISS4SearchQuery;
    // WARNING: From some wack reason eslint panics if this is a private class
    // member. I this is fixed in a later version of eslint or one of the eslint
    // plugins but upgrading it now introduced too much noise into this MR so
    // leaving that for later.
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
        this.#izzyQuery = query
        this.#issQuery = issQuery
    }

    async loadNextPage(): Promise<void> {
        const issClient = await getIssClient()
        const offset = this.#pagesLoaded * this.#maxPageSize
        const res = await issClient.search({
            ...this.#issQuery,
            ...(offset ? {offset} : undefined),
            limit: this.#maxPageSize,
        })

        const {results, ...meta} = res
        this._lastMeta = meta
        const services = results.map(
            serviceData => new Service(serviceData)
        )
        this.#loadedServices.push(...services)
        this.#pagesLoaded++;
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

    get isNext(): boolean | null | undefined {
        return Boolean(this._lastMeta?.next)
    }
}

export function isDisabilityAdvocacySearch(
    router: NextRouter
): boolean {
    return decodeURIComponent((router.query.categoryOrContentPageSlug as string)) ===
        "disability-advocacy-finder"
}

// Since this function is responsible for mapping a whole bunch of properties
// that may exist in IzzySearchQuery there are lot of if statements used
// which trip eslint's complexity rule. However due to the nature of these
// mappings each of these if statements that map a property should be pretty
// self-contained so this function shouldn't actually be a complex as it appears
// eslint.
// eslint-disable-next-line complexity
export function convertIzzySearchQueryToIss(
    query: IzzySearchQuery
): ISS4SearchQuery {
    const issQuery: ISS4SearchQuery = {
        fields: SEARCH_RESULT_FIELDS,
    }

    if (query.term) {
        issQuery["search-terms"] = query.term.join(" ")
    }

    if (query.siteId) {
        issQuery.site = String(query.siteId)
    }

    if (query.serviceTypes) {
        issQuery["service-type"] = query.serviceTypes
    }

    if (typeof query.caldSpecific === "boolean") {
        issQuery["is-cald-specific"] = query.caldSpecific
    }

    if (query.indigenousClassification) {
        issQuery["indigenous-classification"] = query.indigenousClassification
    }

    if (query.clientGenders) {
        issQuery["target-gender"] = query.clientGenders.map(
            gender => ({
                Female: "female",
                Male: "male",
                Diverse: "other",
                unspecified: "unspecified",
            }[gender])
        )
    }

    if (query.ageGroups) {
        issQuery["age-group"] = query.ageGroups.filter(
            ageGroup => ageGroup !== "unspecified"
        )
    }

    if (query.location) {
        const locationName = normaliseLocationName(query.location.name)
        const coordinates = query.location.coordinates
        issQuery["located-near"] = coordinates ?
            `${coordinates.latitude},${coordinates.longitude}`
            : locationName

        if (query.catchment === "true") {
            issQuery.catchment = locationName
        } else if (query.catchment === "prefer") {
            issQuery["prefer-catchment"] = locationName
        }
    }

    if (query.name) {
        issQuery.name = query.name
    }

    return issQuery
}

/*
 * Convert a location name as used in Izzy (eg "Richmond, VIC") to the format
 * ISS expects (eg "richmond,vic").
 */
function normaliseLocationName(locationName: string): string {
    return locationName
        .split(",")
        .map(part => part.trim().toLowerCase())
        .join(",")
}
