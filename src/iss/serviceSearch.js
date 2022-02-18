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
import type {SearchQuery as IzzySearchQuery} from "./searchQueryBuilder"


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
    storage.setItem("previous_search_url", searchUrl, false);
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

    if (storage.getUserGeolocation()) {
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


// eslint-disable-next-line complexity
export function convertIzzySearchQueryToIss3(
    query: IzzySearchQuery
): serviceSearchRequest {
    const issQuery: $Shape<serviceSearchRequest> = {}

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
                "\"Homelessness Access Point\""
        )
    ) {
        q = q.replace(
            "-\"coordinating bodies\" -\"holiday accommodation\" " +
                "\"Homelessness Access Point\"",
            " -\"coordinating bodies\"    -\"holiday accommodation\"  " +
                "\"Homelessness Access Point\""
        )
    } else if (q.startsWith("meals -\"home care\"")) {
        q = q.replace(
            "meals -\"home care\"",
            "meals  -\"home care\""
        )
    } else if (
        q.startsWith(
            "-\"coordinating bodies\" -\"fire-fighting\" " +
                "\"men's behaviour change\""
        )
    ) {
        q = q.replace(
            "-\"coordinating bodies\" -\"fire-fighting\" " +
                "\"men's behaviour change\"",
            " -\"coordinating bodies\" -\"fire-fighting\"  " +
                "\"men's behaviour change\""
        )
    } else if (q.startsWith("legal -\"coordinating bodies\"")) {
        q = q.replace(
            "legal -\"coordinating bodies\"",
            "legal  -\"coordinating bodies\""
        )
    } else if (
        q.match(
            "-\"assistance with meals\" -\"hire of facilities\" " +
                "-\"meal preparation\""
        )
    ) {
        q = " " + q
        q = q.replace(
            "-\"assistance with meals\" -\"hire of facilities\" " +
                "-\"meal preparation\"",
            " -\"assistance with meals\" -\"hire of facilities\"  " +
                "-\"meal preparation\""
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
            "name:\"financial counselling\""
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
                : serviceType
        )
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
