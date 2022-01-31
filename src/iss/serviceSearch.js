/* @flow */
import lru from "lru-cache";

import Service, {attachTransportTimes} from "./Service";
import storage from "../storage";
import ServiceSearchCache from "./ServiceSearchCache";
import {getIssClient} from "./client"
import type {searchResultsMeta} from "./search";
import {serialiseUrlQueryParams} from "../utils/url"
import {
    TryWithDefault,
} from "../timeout";
import * as gtm from "../google-tag-manager";
import type { RouterContextObject } from "../contexts/router-context";
import {getPersonalisationPages, getCategoryFromRouter} from "../utils/personalisation"
import WhoIsLookingForHelpPage from
    "../pages/personalisation/WhoIsLookingForHelp"
import type {SearchQuery as IssSearchQuery} from "../ix-web-js-client/apis/iss.js"
import type {SearchQuery as IzzySearchQuery} from "./searchQueryBuilder"
import type {Geolocation} from "../storage";


export type serviceSearchResultsMeta = {
    ...searchResultsMeta,
    available_count: number,
    location: {
        name: string,
        suburb: string,
        state: string,
        lat: number,
        lon: number,
    },
}

export type serviceSearchResults = {|
    meta: serviceSearchResultsMeta,
    services: Array<Service>,
|};

convertIzzySearchQueryToIss

export type Props = {
    ...IzzySearchQuery,
    pageSize: number
}


export function createServiceSearch({
    pageSize,
    ...query
}: Props): PaginatedSearch {
    return new PaginatedSearch(query, pageSize)
}

class PaginatedSearch {
    #query: IssSearchQuery;
    #pagesLoaded: number = 0;
    #pageSize: number;
    #loadedServices: Array<Service> = [];

    constructor(query: IzzySearchQuery, pageSize: number) {
        this.#query = convertIzzySearchQueryToIss(query)
        this.#pageSize = pageSize
    }

    async loadNextPage() {
        const issClient = await getIssClient()
        const res = await issClient.search({
            ...this.#query,
            page: {
                current: this.#pagesLoaded + 1,
                size: this.#pageSize
            }
        })
        this.#pagesLoaded++;
        const services = res.results.map(
            serviceData => new Service(serviceData)
        )
        this.#loadedServices.push(...services)
    }

    get loadedServices(): Array<Service> {
        return this.#loadedServices
    }

    get numOfPagesLoaded(): number {
        return this.#pagesLoaded
    }
}

/**
 * Execute a search against ISS.
 *
 * @param {searchRequest} query - either a query string, or an object of
 * search parameters.
 *
 * @returns {Promise<serviceSearchResults>} search results from ISS.
 */
export async function initialSearchForServices(
    query: serviceSearchRequest,
): Promise<serviceSearchResults> {
    let request_: serviceSearchRequest = {
        q: "",
        type: "service",
        limit: 10,
    };

    const searchUrlPath = "/api/v3/search/";
    const previousSearchUrl: string =
        (storage.getItem("previous_search_url"): any);

    Object.assign(request_, query);
    let searchUrl = serialiseUrlQueryParams(searchUrlPath, request_);

    const whoIsLookingForHelp = String(storage.getItem(
        WhoIsLookingForHelpPage.defaultProps.name
    ))
    if (searchUrl != previousSearchUrl) {
        gtm.emit({
            event: "New Search On Behalf Of",
            eventCat: "Services Searched",
            eventAction: "Help Seeker Type",
            eventLabel: whoIsLookingForHelp,
            sendDirectlyToGA: true,
        });

        gtm.emit({
            event: "Action Triggered - New Search",
            eventCat: "Action triggered",
            eventAction: "New search request",
            eventLabel: whoIsLookingForHelp ?
                whoIsLookingForHelp
                : "<not answered>",
            sendDirectlyToGA: true,
        });
    }
    storage.setItem("previous_search_url", searchUrl);
    return await searchForServices(searchUrlPath, request_);
}

export async function searchForServices(
    path: string,
    data: ?serviceSearchRequest,
): Promise<serviceSearchResults> {
    const url_ = serialiseUrlQueryParams(path, data);

    if (searchResultsCache.getPageForQuery(url_)) {
        const resultWithAllPages = searchResultsCache
            .getAllPagesForQuery(url_)
        if (!resultWithAllPages) {
            // This should never happen. If we've cached this specific page then
            // we should have a cache match for all pages relating to this query
            console.warn("Search cache hit for single page but not all pages")
        } else {
            return resultWithAllPages;
        }
    }


    const issClient = await getIssClient()

    const res = await issClient.search(query)

    const {meta, objects} = await await searchIss(path, data);

    // convert objects to ISS search results
    let services: Array<Service> = objects.map(
        (object: Object): Service => new Service(object)
    );

    if (storage.getLocation()) {
        services = await TryWithDefault(
            3000,
            attachTransportTimes(services),
            services
        )
    }

    services.forEach((service) =>
        serviceCache.set(service.id, service)
    )

    const searchResults = {
        meta,
        services,
    }

    searchResultsCache.revise(url_, searchResults);

    // searchResults should never be returned but we provided it as a fail safe
    // to keep flow happy.
    return searchResultsCache.getAllPagesForQuery(url_) || searchResults;
}

const searchResultsCache = new ServiceSearchCache();
const serviceCache = lru({
    max: 150, // Only track 150 keys in the cache
    maxAge: 1000 * 60 * 60, // Discard anything over 1 hour
});

export function getServiceFromCache(serviceId: number): ?Service {
    return serviceCache.get(serviceId)
}

export function forEachServiceFromCache(
    callback: (service: Service) => any
): void {
    serviceCache.forEach(callback)
}


export function isDisabilityAdvocacySearch(
    router: $PropertyType<RouterContextObject, 'router'>
): boolean {
    return decodeURIComponent(router.match.params.search) ===
        "Disability Advocacy Providers"
}




function convertIzzySearchQueryToIss(query: IzzySearchQuery): IssSearchQuery {
    const issQuery: IssSearchQuery = {
        filters: {
            all: [
                {
                    object_type: "Service"
                }
            ]
        }
    }

    if (query.term) {
        issQuery.query = query.term.join(" ")
    }

    if (query.serviceTypes) {
        issQuery.filters?.all?.push({
            service_types: query.serviceTypes
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
        if (!issQuery.boosts) {
            issQuery.boosts = {}
        }
        issQuery.boosts.location_approximate_geopoint = [
            {
                type: "proximity",
                function: "exponential",
                center: `${query.location.latitude},${query.location.longitude}`,
                factor: 20
            }
        ]
        issQuery.filters?.all?.push({
            location_approximate_geopoint: {
                center: `${query.location.latitude},${query.location.longitude}`,
                distance: 300,
                unit: "km"
            }
        })
    }
    console.log('converting izzy to iss', query, issQuery)

    return issQuery
}
