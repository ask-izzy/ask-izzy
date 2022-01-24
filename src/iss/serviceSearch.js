/* @flow */
import lru from "lru-cache";

import Service, {attachTransportTimes} from "./Service";
import storage from "../storage";
import ServiceSearchCache from "./ServiceSearchCache";
import {searchIss} from "./search";
import type {searchResultsMeta} from "./search";
import {serialiseUrlQueryParams} from "../utils/url"
import {
    TryWithDefault,
} from "../timeout";
import * as gtm from "../google-tag-manager";
import type { RouterContextObject } from "../contexts/router-context";
import {getCategoryFromRouter} from "../utils/personalisation"
import WhoIsLookingForHelpPage from
    "../pages/personalisation/WhoIsLookingForHelp"

export type serviceSearchRequest = {|
    q?: string,
    service_type?: Array<string>,
    service_type_raw?: Array<string>,
    site_id?: number,
    name?: string,

    minimum_should_match?: string,

    area?: string,
    location?: string,
    type?: string,
    age_group?: Array<string>,
    client_gender?: Array<string>,

    catchment?: "prefer"|"true"|"false",
    is_bulk_billing?: boolean,
    show_in_askizzy_health?: boolean,

    limit?: number,
    key?: string,
|};

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

export function getInitialSearchRequest(
    router: $PropertyType<RouterContextObject, 'router'>
): serviceSearchRequest {
    let request: serviceSearchRequest
    const category = getCategoryFromRouter(router)

    if (category) {
        request = {...category.search};
    } else if (router.match.params.search) {
        request = {
            q: decodeURIComponent(router.match.params.search),
        };
    } else {
        request = {
            q: "undefined-search",
        };
    }

    // A special case for the "Find advocacy" button on the
    // DisabilityAdvocacyFinder page.
    if (request.q === "Disability Advocacy Providers") {
        // $FlowIgnore because flow is acting wack about "decodeURIComponent"
        // above for some reason
        // $FlowIgnore
        request.service_type_raw = ["disability advocacy"]
        request.q = "disability"
    }

    return request
}

export function isDisabilityAdvocacySearch(
    router: $PropertyType<RouterContextObject, 'router'>
): boolean {
    return decodeURIComponent(router.match.params.search) ===
        "Disability Advocacy Providers"
}
